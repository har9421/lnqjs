import { select } from "../select";

const array = [
  { firstName: "Harshad", lastName: "karemore" },
  { firstName: "HARhal", lastName: "more" }
];

const nestedArray = {
  store: {
    employees: [
      {
        name: "bob",
        hiredate: "2015-01-01"
      },
      {
        name: "sam",
        hiredate: "2015-01-02"
      },
      {
        name: "ken",
        hiredate: "2015-01-03"
      }
    ],
    books: [
      {
        category: "reference",
        author: "bob",
        title: "hellooo1",
        price: 1.95,
        sections: ["s1", "s2", "s3"]
      },
      {
        category: "fiction",
        author: "sam",
        title: "hellooo2",
        price: 1.96,
        sections: ["s4", "s1", "s3"]
      },
      {
        category: "science",
        author: "steve",
        title: "hellooo3",
        tag: "1bcd",
        price: 11,
        sections: ["s9", "s2", "s3"]
      }
    ],
    location: {
      street: "123 Main St.",
      city: "Newyork",
      state: "GA"
    }
  }
};

describe("select", () => {
  it("return perticular prop from array", () => {
    const getSelect = select(array, arr => arr.lastName);
    expect(getSelect).toEqual(["karemore", "more"]);
  });

  it("return complete from array", () => {
    const getSelect = select(array, arr => arr);
    expect(getSelect).toEqual(getSelect);
  });

  it("return complete from array complex", () => {
    const getSelect = select(nestedArray.store.books, arr => {
      return {
        category: arr.category,
        author: arr.author,
        sections: arr.sections
      };
    });
    expect(getSelect).toEqual("");
  });

  it("return lowercase for first name", () => {
    const getSelect = select(array, arr => arr.firstName.toLowerCase());
    console.log(getSelect);
    expect(getSelect).toEqual("");
  });
});
