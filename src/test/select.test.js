import { select } from "../select";

describe("select test", () => {
  it("get array lenght", () => {
    const getSelect = select([0, 1, 2]);
    expect(getSelect).toBe(3);
  });
});
