import { collection, getDocs, query, where, getCountFromServer } from 'firebase/firestore';
import { db } from '@/firebase';

export async function getDashboardStats(ownerUid?: string) {
    let totalProjects = 0;
    let userSitesCount = 0;

    try {
        const countSnapshot = await getCountFromServer(collection(db, 'inventory_projects'));
        totalProjects = countSnapshot.data().count;
    } catch (error) {
        console.error('Failed to count inventory projects:', error);
    }

    if (ownerUid) {
        try {
            const sitesQuery = query(collection(db, 'sites'), where('ownerUid', '==', ownerUid));
            const sitesSnap = await getDocs(sitesQuery);
            userSitesCount = sitesSnap.size;
        } catch (e) {
            console.error("Error fetching dashboard stats:", e);
        }
    }

    return {
        totalProjects,
        userSites: userSitesCount,
        newLeads: 0,
        systemHealth: "100%",
        aiEfficiency: "94%"
    };
}
