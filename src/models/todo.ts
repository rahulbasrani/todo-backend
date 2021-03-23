import { BaseModel } from './base-model';
import { LooseObject } from '@typings';

export class TodoItem extends BaseModel {
  title: string;
  isActive: boolean;
  deletedAt: Date;
  constructor(json?: LooseObject) {
    super(json);
    if (json) {
      this.title = json.title;
      this.isActive = json.isActive;
      this.deletedAt = json.deletedAt;
    }
  }

  public serialize(): LooseObject {
    return {
      id: this._id,
      title: this.title,
      deletedAt: this.deletedAt,
    };
  }
}
