import { $, NoSerialize, component$, noSerialize, useOnWindow, useSignal, useVisibleTask$ } from '@builder.io/qwik';

import Phaser from 'phaser';
import { useDebouncer } from '~/utils/useDebouncer';

export default component$(() => {
  const parentEl = useSignal<HTMLDivElement>();
  const game = useSignal<NoSerialize<Phaser.Game> | null>(null);

  const debounce = useDebouncer(
    $((fn: Function) => {
      fn();
    }),
    500
  );

  useVisibleTask$(({ track }) => {
    track(() => parentEl.value);
    if (!parentEl.value || game.value) return;
    let newGame: Phaser.Game;
    const phaserScript = document.createElement('script');
    phaserScript.setAttribute('src', '/phaser.min.js');
    phaserScript.onload = () => {
      class Scene1 extends Phaser.Scene {
        gameObject: any;
        dragX: any;
        dragY: any;
        constructor() {
          super('Scene1');
        }
        init() {
          console.log('init');
        }
        preload() {
          // this.time.advancedTiming = true;
          console.log('preload');
          this.load.atlas('sheet', '/2d_assets/sprite.png', '/2d_assets/sprite.json');

          // Load body shapes from JSON file generated using PhysicsEditor
          this.load.json('shapes', '/2d_assets/all.json');
        }
        create() {
          console.log('create');
          this.input.on('gameobjectwheel', () => {
            console.log('gameobjectwheel');
          });
          this.input.on('wheel', () => {
            console.log('wheel');
          });
          this.input.on('scroll', () => {
            console.log('scroll');
          });
          const shapes = this.cache.json.get('shapes');
          this.matter.world.setBounds(0, 0, parentEl.value!.offsetWidth, parentEl.value!.offsetHeight);
          const sprite = this.matter.add
            .sprite(200, 50, 'sheet', 'small_css.png', { shape: shapes.small_css })
            .setInteractive();
          const sprite2 = this.matter.add
            .sprite(200, 50, 'sheet', 'small_js.png', { shape: shapes.small_js })
            .setInteractive();
          this.input.setDraggable(sprite, true);
          this.input.setDraggable(sprite2, true);
          this.input.on('drag', (pointer: any, gameObject: any, dragX: any, dragY: any) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
            this.gameObject = gameObject;
            this.dragX = dragX;
            this.dragY = dragY;
            setPhysicsOn(gameObject, false);
          });
          this.input.on('dragstart', (pointer: any, gameObject: any) => {
            setPhysicsOn(gameObject, false);
          });
          this.input.on('dragend', (pointer: any, gameObject: any) => {
            this.gameObject = null;
            setPhysicsOn(gameObject, true);
          });
          function setPhysicsOn(sprite: any, val = true) {
            sprite.body.enable = val;
            // sprite.setCollisionCategory(val ? 1 : null);
            sprite.setIgnoreGravity(!val);
            if (!val) {
              sprite.setAngularVelocity(0);
              sprite.setVelocity(0, 0);
            }
          }
          console.log('shapes', shapes);
        }
        update() {
          const loop = this.sys.game.loop;
          if (this.gameObject) {
            this.gameObject.x = this.dragX;
            this.gameObject.y = this.dragY;
          }
          console.log(loop.actualFps);
        }
      }

      newGame = new (window as any).Phaser.Game({
        scene: [Scene1],
        physics: {
          default: 'matter',
          matter: {
            debug: true,
          },
        },
        transparent: true,
        type: (window as any).Phaser.AUTO,
        parent: parentEl.value,
        width: parentEl.value!.offsetWidth,
        height: parentEl.value!.offsetHeight,
      });

      game.value = noSerialize(newGame);
    };
    document.body.append(phaserScript);
    return () => {
      newGame?.destroy(true, true);
    };
  });

  useOnWindow(
    'resize',
    $(() => {
      if (game.value && game.value.isBooted) {
        debounce(() => {
          if (!parentEl.value) return;
          console.log('resize');
          game.value!.scale.resize(parentEl.value.offsetWidth, parentEl.value.offsetHeight);
          game.value!.scene.scenes[0].matter.world.setBounds(
            0,
            0,
            parentEl.value!.offsetWidth,
            parentEl.value!.offsetHeight
          )
          // game.value!.scene.getAt(0).matter.world.setBounds(0, 0, parentEl.value!.offsetWidth, parentEl.value!.offsetHeight);
          game.value!.canvas.setAttribute(
            'style',
            `display: block; width: ${parentEl.value.offsetWidth} px; height: ${parentEl.value.offsetHeight}px;`
          );
        });
      }
    })
  );

  return (
    <div class="relative h-screen w-full">
      <main>Hello World</main>
      <div ref={parentEl} class="absolute top-0 h-full w-full bg-red-500 bg-transparent "></div>
    </div>
  );
});
