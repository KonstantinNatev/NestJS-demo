import { Injectable, NotFoundException } from "@nestjs/common";
import { Reports } from "./reports.entity";
import { Repository } from "typeorm/repository/Repository";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateReportDto } from "./dto/create-report.dto";
import { User } from "src/users/user.entity";
import { ApprovedReportDto } from "./dto/approved-report.dto";

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Reports) private repo: Repository<Reports>) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;
    return this.repo.save(report);
  }

  async changeApproval(id: number, approved: boolean) {
    const report = await this.repo.findOneBy({ id });

    if (!this.repo) {
      throw new NotFoundException("changeApproval: the report does not found!");
    }

    report.approved = approved;
    return this.repo.save(report);
  }
}
