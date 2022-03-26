// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVuU77lr4SMGtLdpJy2YW9gyHwyEO5f2Y",
  authDomain: "reality-hack.firebaseapp.com",
  projectId: "reality-hack",
  storageBucket: "reality-hack.appspot.com",
  messagingSenderId: "781486086310",
  appId: "1:781486086310:web:a44c7c775f5cc8ed89fc67",
};

// Initialize Firebase
let app;
let db;

const bootstrap = async () => {
  app = initializeApp(firebaseConfig);

  db = getFirestore(app);
};

bootstrap();

export const addStone = async (stoneData) => {
  const docRef = await addDoc(collection(db, "stones"), stoneData);
  console.log("Stone deposited with ID: ", docRef.id);
};

export const getStones = async () => {
  const querySnapshot = await getDocs(collection(db, "stones"));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
  });
  return true;
};

// const stones = getStones();

// useEffect(() => {
//   addStone({ position: "hello again" });
//   console.log("should be updated");
// }, [hasGrabbed]);