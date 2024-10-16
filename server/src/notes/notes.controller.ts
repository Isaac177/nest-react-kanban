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
import {
  CreateNoteDto,
  UpdateNoteDto,
  MoveNoteDto,
} from './dto/note.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { I18nService } from 'nestjs-i18n';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(
    private readonly notesService: NotesService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  async create(
    @Body() createNoteDto: CreateNoteDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const note = await this.notesService.create(
      createNoteDto,
      req.user.userId,
    );
    return {
      message: await this.i18n.translate('notes.noteCreated'),
      note,
    };
  }

  @Get()
  async findAll(@Req() req: AuthenticatedRequest) {
    const notes = await this.notesService.findAll(req.user.userId);
    return {
      message: await this.i18n.translate('notes.allNotesRetrieved'),
      notes,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const note = await this.notesService.findOne(id, req.user.userId);
    return {
      message: await this.i18n.translate('notes.noteRetrieved'),
      note,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const note = await this.notesService.update(
      id,
      updateNoteDto,
      req.user.userId,
    );
    return {
      message: await this.i18n.translate('notes.noteUpdated'),
      note,
    };
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.notesService.remove(id, req.user.userId);
    return {
      message: await this.i18n.translate('notes.noteDeleted'),
    };
  }

  @Patch(':id/move')
  async moveNote(
    @Param('id') id: string,
    @Body() moveNoteDto: MoveNoteDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const note = await this.notesService.moveNote(
      id,
      moveNoteDto,
      req.user.userId,
    );
    return {
      message: await this.i18n.translate('notes.noteMoved'),
      note,
    };
  }

  @Patch(':id/archive')
  async archiveNote(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const note = await this.notesService.archiveNote(
      id,
      req.user.userId,
    );
    return {
      message: await this.i18n.translate('notes.noteArchived'),
      note,
    };
  }

  @Get('archived')
  async getArchivedNotes(@Req() req: AuthenticatedRequest) {
    const notes = await this.notesService.getArchivedNotes(
      req.user.userId,
    );
    return {
      message: await this.i18n.translate('notes.archivedNotesRetrieved'),
      notes,
    };
  }
}
