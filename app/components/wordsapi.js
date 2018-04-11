class WordsAPI {
    static convertToEntry(json) {
        let entry = {};
        entry.word=json.word;
        entry.definitions=[];

        if (json.results) {
            entry.definitions=json.results.map((res)=>({definition:res.definition,partOfSpeech:res.partOfSpeech}))
        }

        if (json.syllables && json.syllables.list){
            entry.syllables=json.syllables.list.join("•");
        }
        if (json.pronunciation && json.pronunciation.all){
            entry.pronunciation=json.pronunciation.all;
        }
        return entry;
    }
}

export default WordsAPI;
