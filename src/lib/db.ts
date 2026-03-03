import { firestore } from './firebase';
import { collection, doc, getDoc, getDocs, setDoc, query, where } from 'firebase/firestore';

export class DB {
    static async query<T>(sql: string, params: any[] = []): Promise<T[]> {
        // Handle Firestore queries for web
        if (!window.electronAPI) {
            if (sql.includes('SELECT * FROM lessons WHERE id = ?')) {
                const lessonDoc = await getDoc(doc(firestore, 'lessons', params[0]));
                if (lessonDoc.exists()) {
                    const data = lessonDoc.data();
                    return [{ id: lessonDoc.id, content_json: JSON.stringify(data) }] as any;
                }
            }
            if (sql.includes('SELECT * FROM lessons WHERE moduleId = ?')) {
                const q = query(collection(firestore, 'lessons'), where('moduleId', '==', params[0]));
                const snapshot = await getDocs(q);
                return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any;
            }
        }

        if (window.electronAPI && window.electronAPI.dbQuery) {
            const result = await window.electronAPI.dbQuery(sql, params);
            return result;
        }

        // Final Browser Fallback (Local Storage)
        if (sql.includes('SELECT * FROM lessons')) {
            const id = params[0];
            const data = localStorage.getItem(`mock_db_lesson_${id}`);
            return data ? [JSON.parse(data)] : [];
        }
        return [];
    }

    static async execute(sql: string, params: any[] = []): Promise<any> {
        if (window.electronAPI && window.electronAPI.dbExecute) {
            return window.electronAPI.dbExecute(sql, params);
        }
        return { changes: 1 };
    }

    // --- Learning ---

    static async getLesson(lessonId: string): Promise<any> {
        if (!window.electronAPI) {
            const lessonDoc = await getDoc(doc(firestore, 'lessons', lessonId));
            if (lessonDoc.exists()) {
                const data = lessonDoc.data();
                return {
                    id: lessonId,
                    ...data,
                    content_json: data.content_json || JSON.stringify(data)
                };
            }
        }
        const results = await this.query('SELECT * FROM lessons WHERE id = ?', [lessonId]);
        return results[0] || null;
    }

    static async saveLesson(lesson: any) {
        const updatedAt = new Date().toISOString();
        if (!window.electronAPI) {
            await setDoc(doc(firestore, 'lessons', lesson.id), {
                ...lesson,
                updatedAt
            });
            return;
        }

        const existing = await this.getLesson(lesson.id);
        if (existing) {
            return this.execute(
                'UPDATE lessons SET title = ?, content_json = ?, isPublished = ?, updatedAt = ? WHERE id = ?',
                [lesson.title, JSON.stringify(lesson), lesson.isPublished ? 1 : 0, updatedAt, lesson.id]
            );
        } else {
            return this.execute(
                'INSERT INTO lessons (id, moduleId, title, content_json, isPublished, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
                [lesson.id, lesson.moduleId, lesson.title, JSON.stringify(lesson), 0, updatedAt]
            );
        }
    }

    static async uploadMedia(file: File): Promise<any> {
        const id = crypto.randomUUID();
        const updatedAt = new Date().toISOString();
        const extension = file.name.split('.').pop();
        const fileName = `${id}.${extension}`;

        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        if (window.electronAPI) {
            const result = await window.electronAPI.saveMedia(fileName, uint8Array);
            return { id, fileName, path: result.path };
        }

        // No web media upload implemented yet, just return dummy/local info
        return { id, fileName, path: URL.createObjectURL(file), updatedAt };
    }
}
