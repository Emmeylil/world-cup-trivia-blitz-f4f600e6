import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  serverTimestamp,
  setDoc,
  doc,
  deleteDoc
} from "firebase/firestore";

import { db } from "./firebase";
import { Profile } from "./game-data";

export interface ScoreEntry {
  name: string;
  email: string;
  score: number;
  timestamp: any;
  streak: number;
}

export const firebaseService = {
  async saveScore(profile: Profile, score: number, streak: number) {
    try {
      const scoresRef = collection(db, "scores");
      await addDoc(scoresRef, {
        name: profile.name,
        email: profile.email,
        score: score,
        streak: streak,
        timestamp: serverTimestamp(),
      });

      // Also sync user profile
      const userRef = doc(db, "users", profile.email);
      await setDoc(userRef, {
        name: profile.name,
        email: profile.email,
        lastPlayed: serverTimestamp(),
        joined: profile.joined
      }, { merge: true });

    } catch (error) {
      console.error("Error saving score:", error);
    }
  },

  async getLeaderboard(limitCount = 10) {
    try {
      const scoresRef = collection(db, "scores");
      const q = query(scoresRef, orderBy("score", "desc"), limit(limitCount));
      const querySnapshot = await getDocs(q);
      
      const leaderboard: any[] = [];
      querySnapshot.forEach((doc) => {
        leaderboard.push({ id: doc.id, ...doc.data() });
      });
      
      return leaderboard;
    } catch (error) {
      console.error("Error getting leaderboard:", error);
      return [];
    }
  },

  async fetchQuestions() {
    try {
      const qRef = collection(db, "questions");
      const q = query(qRef, orderBy("id", "asc"));
      const querySnapshot = await getDocs(q);
      
      const questions: any[] = [];
      querySnapshot.forEach((doc) => {
        questions.push({ firestoreId: doc.id, ...doc.data() });
      });
      
      return questions;
    } catch (error) {
      console.error("Error fetching questions:", error);
      return [];
    }
  },

  async saveQuestion(question: any) {
    try {
      const qRef = collection(db, "questions");
      if (question.firestoreId) {
        const docRef = doc(db, "questions", question.firestoreId);
        const { firestoreId, ...data } = question;
        await setDoc(docRef, data, { merge: true });
      } else {
        await addDoc(qRef, question);
      }
    } catch (error) {
      console.error("Error saving question:", error);
      throw error;
    }
  },

  async deleteQuestion(firestoreId: string) {
    try {
      const docRef = doc(db, "questions", firestoreId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting question:", error);
      throw error;
    }
  }
};


