
const admin = require('firebase-admin');

admin.initializeApp({
  projectId: 'studio-400579658-555a8'
});

const db = admin.firestore();

const docRef = db.collection('inventory_projects').doc('placeholder');

docRef.set({
  name: 'Placeholder Project',
  description: 'This is a placeholder project.'
}).then(() => {
  console.log('Document successfully written!');
  process.exit(0);
}).catch((error) => {
    console.error('Error writing document: ', error);
    process.exit(1);
});
