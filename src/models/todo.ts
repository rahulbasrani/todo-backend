import { BaseModel } from "./base-model";
import { LooseObject } from "@typings";

export class TodoItem extends BaseModel {
  title: string;
<<<<<<< Updated upstream
  isActive: boolean;
  deletedAt: Date;
=======

>>>>>>> Stashed changes
  constructor(json?: LooseObject) {
    super(json);
    if (json) {
      this.title = json.title;
<<<<<<< Updated upstream
      this.isActive = json.isActive;
      this.deletedAt = json.deletedAt;
=======
>>>>>>> Stashed changes
    }
  }

  public serialize(): LooseObject {
    return {
      id: this._id,
      title: this.title,
<<<<<<< Updated upstream
      deletedAt: this.deletedAt,
=======
>>>>>>> Stashed changes
    };
  }
}
