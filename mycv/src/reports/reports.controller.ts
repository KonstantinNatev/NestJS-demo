import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CreateReportDto } from "./dto/create-report.dto";
import { ReportsService } from "./reports.service";
import { AuthGuard } from "src/guards/auth.guard";
import { CurrentUser } from "src/users/decorators/current-user.decorator";
import { User } from "src/users/user.entity";
import { Serialize } from "src/interceptors/serialize.interceptor";
import { ReportDto } from "./dto/report.dto";
import { ApprovedReportDto } from "./dto/approved-report.dto";
import { AdminGuard } from "src/guards/admin.guard";

@Controller("reports")
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createPost(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    this.reportsService.create(body, user);
  }

  @Patch("/:id")
  @UseGuards(AdminGuard)
  approvedReports(@Param("id") id: string, @Body() body: ApprovedReportDto) {
    return this.reportsService.changeApproval(parseInt(id), body.approved);
  }
}
