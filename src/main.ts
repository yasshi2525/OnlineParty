import { GameMainParameterObject, RPGAtsumaruWindow } from "./parameterObject";
import { Participant } from "./participant";

declare const window: RPGAtsumaruWindow;

export function main(param: GameMainParameterObject): void {
  const scene = new g.Scene({
    game: g.game,
    name: "メイン"
  });
  let time = 60; // 制限時間
  if (param.sessionParameter.totalTimeLimit) {
    time = param.sessionParameter.totalTimeLimit; // セッションパラメータで制限時間が指定されたらその値を使用します
  }
  // 市場コンテンツのランキングモードでは、g.game.vars.gameState.score の値をスコアとして扱います
  g.game.vars.gameState = { score: 0 };
  scene.onLoad.add(() => {
    const mainLayer = new g.E({
      scene,
      tag: "メインレイヤ",
      width: g.game.width,
      height: g.game.height,
    });
    scene.append(mainLayer);

    new Participant({
      scene,
      parent: mainLayer,
      x: 500,
      y: 500
    });

    // フォントの生成
    const font = new g.DynamicFont({
      game: g.game,
      fontFamily: "sans-serif",
      size: 48
    });

    // スコア表示用のラベル
    const scoreLabel = new g.Label({
      scene: scene,
      text: "SCORE: 0",
      font: font,
      fontSize: font.size / 2,
      textColor: "black"
    });
    scene.append(scoreLabel);

    // 残り時間表示用ラベル
    const timeLabel = new g.Label({
      scene: scene,
      text: "TIME: 0",
      font: font,
      fontSize: font.size / 2,
      textColor: "black",
      x: 0.65 * g.game.width
    });
    scene.append(timeLabel);

    const updateHandler = (): void => {
      if (time <= 0) {
        // RPGアツマール環境であればランキングを表示します
        if (param.isAtsumaru) {
          const boardId = 1;
          window.RPGAtsumaru.experimental.scoreboards.setRecord(boardId, g.game.vars.gameState.score).then(function () {
            window.RPGAtsumaru.experimental.scoreboards.display(boardId);
          });
        }
        scene.onUpdate.remove(updateHandler); // カウントダウンを止めるためにこのイベントハンドラを削除します
      }
      // カウントダウン処理
      time -= 1 / g.game.fps;
      timeLabel.text = "TIME: " + Math.ceil(time);
      timeLabel.invalidate();
    };
    scene.onUpdate.add(updateHandler);
    // ここまでゲーム内容を記述します
  });
  g.game.pushScene(scene);
}
