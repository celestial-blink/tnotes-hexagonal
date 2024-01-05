import bcrypt from "bcryptjs";

export default class Crypt {
    static async hash(text: string): Promise<string> {
        return await bcrypt.hash(text, 10);
    }

    static async compare(
        textOriginal: string,
        textHashed: string
    ): Promise<boolean> {
        return await bcrypt.compare(textOriginal, textHashed);
    }
}
