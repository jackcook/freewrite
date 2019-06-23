import Request from "./request";

class Api {
  static continueText() {
    return new Request("/continue");
  }
}

export default Api;
