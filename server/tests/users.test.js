const expect = require("expect");
const { Users } = require("../utils/users");

describe("Users", () => {
  let users;

  beforeEach(() => {
    users = new Users();
    users.users = [
      {
        id: 1,
        name: "Andrew",
        canDraw: true,
        score: 0
      },
      {
        id: 2,
        name: "John",
        canDraw: false,
        score: 0
      }
    ];
  });

  it("should add new user", () => {
    let user = {
      id: 3,
      name: "Evan",
      canDraw: false,
      score: 0
    };
    users.addUser(user.id, user.name, user.canDraw, user.score);
    expect(users.users).toContainEqual(user);
  });

  it("should find drawer", () => {
    let user = users.getDrawer();
    expect(user.canDraw).toBeTruthy();
  });

  it("should find user", () => {
    let user = users.getUser(2);
    expect(user.id).toBe(2);
  });

  it("should not find user", () => {
    let user = users.getUser(3);
    expect(user).toBeUndefined();
  });

  it("should add 7 points to drawer's score", () => {
    let user = users.addScore(1);
    expect(user.score).toBe(7);
  });

  it("should add 5 points to guesser's score", () => {
    let user = users.addScore(2);
    expect(user.score).toBe(5);
  });

  it("should remove a user", () => {
    let user = users.removeUser(2);
    let removedUser = users.getUser(2);
    expect(user.id).toBe(2);
    expect(removedUser).toBeFalsy();
    expect(users.users).toHaveLength(1);
  });
});
