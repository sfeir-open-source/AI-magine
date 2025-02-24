export class Assert {
  static isNotEmpty(value: any, message: string = 'value is empty') {
    if (value === undefined || value === null || value.length === 0) {
      throw new Error(message);
    }
  }
}
