import { argument, StringReader, Suggestion, Suggestions } from "@jsprismarine/brigadier";
import { CommandSource } from "../command";
import { Vec3 } from "vec3";

export default class BlockPosArgument {
    x: number
    y: number
    z: number


    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    parse(reader: StringReader) : Vec3 {
        this.x = reader.readInt();
        reader.skip();
        this.y = reader.readInt();
        reader.skip();
        this.z = reader.readInt();
        return new Vec3(this.x, this.y, this.z);
    }

    listSuggestions(context, builder) {
        return Suggestions.empty();
    }
    getExamples() {
        return ['1 2 3'];
    }
}