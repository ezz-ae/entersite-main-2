import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/server/firebase-admin";
import { ENTRESTATE_INVENTORY } from "@/data/entrestate-inventory";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '12', 10), 50);

    try {
        const db = getAdminDb();
        const snapshot = await db
            .collection('inventory_projects')
            .orderBy('name')
            .limit(limit)
            .get();

        if (!snapshot.empty) {
            const projects = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            return NextResponse.json({ data: projects });
        }
    } catch (error) {
        console.error('[projects] failed to load inventory_projects', error);
    }

    return NextResponse.json({ data: ENTRESTATE_INVENTORY.slice(0, limit) });
}
