export interface VocabularyItem {
    id: string;
    lemma: string;
    article: 'der' | 'die' | 'das';
    plural: string;
    level: string;
    en: string;
}

export class VocabularyDB {
    static async getVocabularyByLevel(level: string): Promise<VocabularyItem[]> {
        if (typeof window !== 'undefined' && window.electronAPI && typeof window.electronAPI.dbQuery === 'function') {
            // Wait for DB support in Electron later, fallback to mock/localStorage for now
            return this._getFromStorage().filter((v: VocabularyItem) => v.level === level);
        }

        // Browser Fallback
        return this._getFromStorage().filter(v => v.level === level);
    }

    static async getAllVocabulary(): Promise<VocabularyItem[]> {
        if (typeof window !== 'undefined' && window.electronAPI && typeof window.electronAPI.dbQuery === 'function') {
            return this._getFromStorage();
        }
        return this._getFromStorage();
    }

    static async importVocabulary(items: VocabularyItem[]): Promise<void> {
        // Simple mock: we append or replace using LocalStorage. We'll replace all for simplicity in this demo.
        const existing = this._getFromStorage();

        // Merge strategy: Create a map by lemma to avoid duplicates
        const map = new Map<string, VocabularyItem>();
        existing.forEach(v => map.set(v.lemma, v));
        items.forEach(v => {
            if (!v.id) v.id = crypto.randomUUID();
            map.set(v.lemma, v);
        });

        const merged = Array.from(map.values());
        localStorage.setItem('vocabulary_db', JSON.stringify(merged));
    }

    static async prefillDefaultData(): Promise<void> {
        const defaults: VocabularyItem[] = [
            { id: '1', lemma: 'Apfel', article: 'der', plural: 'die Äpfel', level: 'A1.1', en: 'apple' },
            { id: '2', lemma: 'Banane', article: 'die', plural: 'die Bananen', level: 'A1.1', en: 'banana' },
            { id: '3', lemma: 'Auto', article: 'das', plural: 'die Autos', level: 'A1.1', en: 'car' },
            { id: '4', lemma: 'Haus', article: 'das', plural: 'die Häuser', level: 'A1.1', en: 'house' },
            { id: '5', lemma: 'Tisch', article: 'der', plural: 'die Tische', level: 'A1.1', en: 'table' },
            { id: '6', lemma: 'Lampe', article: 'die', plural: 'die Lampen', level: 'A1.1', en: 'lamp' },
            { id: '7', lemma: 'Buch', article: 'das', plural: 'die Bücher', level: 'A1.1', en: 'book' },
            { id: '8', lemma: 'Stuhl', article: 'der', plural: 'die Stühle', level: 'A1.1', en: 'chair' },
            { id: '9', lemma: 'Katze', article: 'die', plural: 'die Katzen', level: 'A1.1', en: 'cat' },
            { id: '10', lemma: 'Hund', article: 'der', plural: 'die Hunde', level: 'A1.1', en: 'dog' },
        ];
        await this.importVocabulary(defaults);
    }

    static async clearAll(): Promise<void> {
        localStorage.removeItem('vocabulary_db');
    }

    private static _getFromStorage(): VocabularyItem[] {
        const data = localStorage.getItem('vocabulary_db');
        if (!data) return [];
        try {
            return JSON.parse(data) as VocabularyItem[];
        } catch {
            return [];
        }
    }
}
