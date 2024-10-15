import {
  IsString,
  IsOptional,
  IsDate,
  IsNumber,
  Min,
  Max,
  IsEnum,
  IsArray,
} from 'class-validator';

export class CreateNoteDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsEnum(['To Do', 'In Progress', 'Done'])
  column: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsDate()
  dueDate?: Date;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  priority?: number;

  @IsOptional()
  @IsString()
  assignedTo?: string;
}

export class UpdateNoteDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsDate()
  dueDate?: Date;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  priority?: number;

  @IsOptional()
  @IsString()
  assignedTo?: string;
}

export class MoveNoteDto {
  @IsEnum(['To Do', 'In Progress', 'Done'])
  column: string;

  @IsNumber()
  @Min(0)
  order: number;
}
