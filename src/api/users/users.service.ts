import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class UsersService {
  constructor(private readonly firebaseService: FirebaseService) {}
}
