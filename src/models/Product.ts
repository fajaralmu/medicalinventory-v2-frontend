import BaseEntity from './BaseEntity';
import Unit from './Unit';

export default class Product extends BaseEntity {
  code?: string;
  name?: string;
  description?: string;
  unit?: Unit;
  utilityTool?: boolean;
  imageNames?: string;

  count?: number;
}
