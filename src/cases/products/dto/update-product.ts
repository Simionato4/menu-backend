import { IsBIC, IsBoolean, IsNumber, IsOptional, IsString, IsUrl, IsUUID, MaxLength, Min } from "class-validator";

export class UpdateProductDto {
    @IsString()
    @MaxLength(60)
    @IsOptional()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNumber ({maxDecimalPlaces: 2})
    @Min(0)
    @IsOptional()
    price?: number;

    @IsOptional()
    @IsUUID()
    categoryId?: string;

    @IsOptional()
    @IsBoolean()
    active?: boolean;

    @IsOptional()
    @IsUrl({ require_protocol: true })
    picture?: string;
}