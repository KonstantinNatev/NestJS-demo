import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
} from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { Serialize } from "src/interceptors/serialize.interceptor";
import { UserDto } from "./dto/user.dto";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import { User } from "./user.entity";
import { AuthGuard } from "src/guards/auth.guard";

@Controller("auth")
@Serialize(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post("/signup")
  async createUser(@Body() body: CreateUserDTO, @Session() session: any) {
    const user = await this.authService.signUp(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post("/signin")
  async signIn(@Body() body: CreateUserDTO, @Session() session: any) {
    const user = await this.authService.signIn(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post("/signout")
  signOut(@Session() session: any) {
    session.userId = null;
  }

  // @Get('/who-am-i')
  // whoAmI(@Session() session: any) {
  //   return this.userService.findOne(session.userId);
  // }

  @Get("/who-am-i")
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Get("/:id")
  async findUser(@Param("id") id: string) {
    console.log("handler is running");
    const user = await this.userService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException("user not found");
    }

    return user;
  }

  @Delete("/:id")
  removeUser(@Param("id") id: string) {
    return this.userService.remove(parseInt(id));
  }

  @Patch("/:id")
  updateUser(@Param("id") id: string, @Body() body: UpdateUserDTO) {
    return this.userService.update(parseInt(id), body);
  }
}
