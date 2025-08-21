import { Expose } from "class-transformer";
import { IsInt, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateTutorialDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    // nếu dùng JWT để lấy author_id từ token thì field này không cần trong body
    @IsInt()
    author_id: number;
}
