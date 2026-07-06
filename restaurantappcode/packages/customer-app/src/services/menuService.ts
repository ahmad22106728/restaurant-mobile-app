import { collection, query, where, getDocs, onSnapshot, Query, Unsubscribe } from 'firebase/firestore';
import { db } from '../config/firebase';
import { MenuItem } from '@restaurant/shared';

export const menuService = {
  async getMenuItems(): Promise<MenuItem[]> {
    const q = query(collection(db, 'menuItems'), where('available', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
  },

  onMenuItemsChange(callback: (items: MenuItem[]) => void): Unsubscribe {
    const q = query(collection(db, 'menuItems'), where('available', '==', true));
    return onSnapshot(q, snapshot => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
      callback(items);
    });
  },

  getMenuItemsByCategory(category: string): (items: MenuItem[]) => MenuItem[] {
    return (items: MenuItem[]) => {
      if (category === 'All') return items;
      return items.filter(item => item.category === category);
    };
  },
};
