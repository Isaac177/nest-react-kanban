import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto, UpdateNoteDto, MoveNoteDto } from './dto/note.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @Req() req: Request) {
    return this.notesService.create(createNoteDto, req.user['userId']);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.notesService.findAll(req.user['userId']);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.notesService.findOne(id, req.user['userId']);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Req() req: Request,
  ) {
    return this.notesService.update(id, updateNoteDto, req.user['userId']);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.notesService.remove(id, req.user['userId']);
  }

  @Patch(':id/move')
  moveNote(
    @Param('id') id: string,
    @Body() moveNoteDto: MoveNoteDto,
    @Req() req: Request,
  ) {
    return this.notesService.moveNote(id, moveNoteDto, req.user['userId']);
  }

  @Patch(':id/archive')
  archiveNote(@Param('id') id: string, @Req() req: Request) {
    return this.notesService.archiveNote(id, req.user['userId']);
  }

  @Get('archived')
  getArchivedNotes(@Req() req: Request) {
    return this.notesService.getArchivedNotes(req.user['userId']);
  }
}
