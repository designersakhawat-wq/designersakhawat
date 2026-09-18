import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { execute, queryOne, query } from "@/lib/db";
import { revalidatePath } from "next/cache";

type Params = { params: Promise<{ id: string }> };

/** GET /api/admin/services/[id] */
export async function GET(req: NextRequest, { params }: Params) {
  return requireAdmin(req, async () => {
    const { id } = await params;
    const service = await queryOne(`
      SELECT s.*, m.storage_path, m.thumb_path, m.medium_path, m.alt_text
      FROM services s
      LEFT JOIN media m ON s.cover_media_id = m.id
      WHERE s.id = ? AND s.deleted_at IS NULL
    `, [id]);

    if (!service) {
      return NextResponse.json({ error: "Service not found." }, { status: 404 });
    }

    const packages = await query(
      "SELECT * FROM service_packages WHERE service_id = ? ORDER BY display_order ASC",
      [id]
    );

    return NextResponse.json({ service, packages });
  });
}

/** PUT /api/admin/services/[id] */
export async function PUT(req: NextRequest, { params }: Params) {
  return requireAdmin(req, async () => {
    const { id } = await params;
    const body = await req.json();
    const { name, slug, description, cover_media_id, pricing_mode, display_order, visible } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required." }, { status: 400 });
    }

    // Check slug uniqueness (excluding self)
    const duplicate = await queryOne(
      "SELECT id FROM services WHERE slug = ? AND id != ? AND deleted_at IS NULL",
      [slug, id]
    );
    if (duplicate) {
      return NextResponse.json({ error: "Slug already in use." }, { status: 409 });
    }

    const service = await queryOne("SELECT slug FROM services WHERE id = ?", [id]);
    const oldSlug = (service as { slug: string } | null)?.slug;

    await execute(
      `UPDATE services SET name=?, slug=?, description=?, cover_media_id=?, pricing_mode=?, display_order=?, visible=? WHERE id=?`,
      [name, slug, description || null, cover_media_id || null, pricing_mode || "quote_only", display_order || 0, visible ? 1 : 0, id]
    );

    await execute(
      "INSERT INTO activity_log (action, entity_type, entity_id, detail) VALUES (?, ?, ?, ?)",
      ["service_updated", "service", parseInt(id), `Updated service: ${name}`]
    );

    revalidatePath("/");
    revalidatePath("/services");
    if (oldSlug) revalidatePath(`/services/${oldSlug}`);
    revalidatePath(`/services/${slug}`);

    return NextResponse.json({ success: true });
  });
}

/** DELETE /api/admin/services/[id] — soft delete (trash) */
export async function DELETE(req: NextRequest, { params }: Params) {
  return requireAdmin(req, async () => {
    const { id } = await params;
    const url = new URL(req.url);
    const permanent = url.searchParams.get("permanent") === "true";

    if (permanent) {
      // Check if used by published projects
      const inUse = await queryOne(
        "SELECT id FROM projects WHERE service_id = ? AND status = 'published' LIMIT 1",
        [id]
      );
      if (inUse) {
        return NextResponse.json(
          { error: "Cannot delete: service has published projects. Unpublish them first." },
          { status: 409 }
        );
      }
      await execute("DELETE FROM services WHERE id = ?", [id]);
      await execute("INSERT INTO activity_log (action, entity_type, entity_id, detail) VALUES (?, ?, ?, ?)",
        ["service_deleted", "service", parseInt(id), "Permanently deleted service"]);
    } else {
      await execute("UPDATE services SET deleted_at = NOW(), visible = 0 WHERE id = ?", [id]);
      await execute("INSERT INTO activity_log (action, entity_type, entity_id, detail) VALUES (?, ?, ?, ?)",
        ["service_trashed", "service", parseInt(id), "Moved service to trash"]);
    }

    revalidatePath("/");
    revalidatePath("/services");

    return NextResponse.json({ success: true });
  });
}

/** PATCH /api/admin/services/[id] — restore from trash */
export async function PATCH(req: NextRequest, { params }: Params) {
  return requireAdmin(req, async () => {
    const { id } = await params;
    const body = await req.json();

    if (body.action === "restore") {
      await execute("UPDATE services SET deleted_at = NULL WHERE id = ?", [id]);
      await execute("INSERT INTO activity_log (action, entity_type, entity_id, detail) VALUES (?, ?, ?, ?)",
        ["service_restored", "service", parseInt(id), "Restored service from trash"]);
      revalidatePath("/services");
      return NextResponse.json({ success: true });
    }

    // Update packages
    if (body.packages !== undefined) {
      // Delete removed packages
      const keepIds = body.packages.filter((p: { id?: number }) => p.id).map((p: { id: number }) => p.id);
      if (keepIds.length > 0) {
        await execute(
          `DELETE FROM service_packages WHERE service_id = ? AND id NOT IN (${keepIds.map(() => "?").join(",")})`,
          [id, ...keepIds]
        );
      } else {
        await execute("DELETE FROM service_packages WHERE service_id = ?", [id]);
      }

      // Upsert packages
      for (const pkg of body.packages) {
        const features = Array.isArray(pkg.features) ? JSON.stringify(pkg.features) : pkg.features_json || null;
        if (pkg.id) {
          await execute(
            `UPDATE service_packages SET name=?, price=?, currency=?, is_starting_from=?, description=?, features_json=?, display_order=?, visible=? WHERE id=? AND service_id=?`,
            [pkg.name, pkg.price || null, pkg.currency || "USD", pkg.is_starting_from ? 1 : 0, pkg.description || null, features, pkg.display_order || 0, pkg.visible !== false ? 1 : 0, pkg.id, id]
          );
        } else {
          await execute(
            `INSERT INTO service_packages (service_id, name, price, currency, is_starting_from, description, features_json, display_order, visible) VALUES (?,?,?,?,?,?,?,?,?)`,
            [id, pkg.name, pkg.price || null, pkg.currency || "USD", pkg.is_starting_from ? 1 : 0, pkg.description || null, features, pkg.display_order || 0, pkg.visible !== false ? 1 : 0]
          );
        }
      }

      revalidatePath(`/services`);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  });
}
