import * as path from "path";
import { GameClient, GameContext, RunnerGame } from "@akashic/headless-akashic";

describe("participants", () => {
  let context: GameContext;
  let client: GameClient<RunnerGame>;
  let game: RunnerGame;
  let scene: g.Scene;

  beforeEach(async () => {
    context = new GameContext({
      gameJsonPath: path.join(__dirname, "..", "game.json"),
    });
    client = await context.getGameClient();
    game = client.game;
    expect(game).toBeDefined();
    expect(game.scene().name).toEqual("bootstrap");

    client.sendMessage({
      type: "start",
      parameters: {
        randomSeed: 0,
      }
    });
    context.step();
    scene = game.scene() as unknown as g.Scene;
    expect(scene.name).toEqual("メイン");
  });

  afterEach(async () => {
    await context.destroy();
  });

  it("マウスドラッグで移動する", () => {
    expect(scene.children.length).toBe(3);

    const mainLayer = scene.children[0];
    expect(mainLayer.tag).toEqual("メインレイヤ");
    expect(mainLayer.children.length).toBe(1);

    const participant = mainLayer.children[0];

    expect(participant.x).toBe(475);
    expect(participant.y).toBe(475);
    expect(participant.width).toBe(50);
    expect(participant.height).toBe(50);
    expect(participant.touchable).toBe(true);

    client.sendPointDown(500, 500, 1);
    context.step();

    client.sendPointMove(100, 100, 1);
    context.step();

    expect(participant.x).toBe(75);
    expect(participant.y).toBe(75);
  });

  it("マウス再ドラッグで移動する", () => {
    const participant = scene.children[0].children[0];

    client.sendPointDown(500, 500, 1);
    context.step();

    client.sendPointMove(100, 100, 1);
    context.step();

    client.sendPointUp(100, 100, 1);
    context.step();

    client.sendPointDown(100, 100, 1);
    context.step();

    client.sendPointMove(300, 300, 1);
    context.step();

    client.sendPointUp(300, 300, 1);
    context.step();

    expect(participant.x).toBe(275);
    expect(participant.y).toBe(275);
  });

  it("マルチタッチに反応しない", () => {
    const participant = scene.children[0].children[0];

    client.sendPointDown(500, 500, 1);
    context.step();

    client.sendPointMove(100, 100, 1);
    context.step();

    client.sendPointDown(100, 100, 2);
    context.step();

    client.sendPointMove(300, 300, 2);
    context.step();

    expect(participant.x).toBe(75);
    expect(participant.y).toBe(75);
  });
});
