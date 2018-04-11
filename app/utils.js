export default class Util {
    static sortByWord(a,b) {
        if (!a || !b || !a.word || !b.word){
            return 0; //TODO: Should this be more robust? This is silly
        }
        return a.word.localeCompare(b.word);
    }
}
