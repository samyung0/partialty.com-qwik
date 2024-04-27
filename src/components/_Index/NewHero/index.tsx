/* eslint-disable qwik/no-react-props */
import type { NoSerialize } from '@builder.io/qwik';
import { $, component$, noSerialize, useOnWindow, useSignal, useStore, useVisibleTask$ } from '@builder.io/qwik';

import Phaser from 'phaser';
import { useDebouncer } from '~/utils/useDebouncer';

import type { LuciaSession } from '~/types/LuciaSession';
import Center from './center';
import { FollowerPointerCard } from './following-pointer';
import getUser from './getUser';
import Nav from './nav';

import Nav2 from '~/components/Nav';

import BlastPNG from '~/assets/img/blast.png';

import { cn } from '~/utils/cn';

export { getUser };

const getUserFn = $(async () => {
  return await fetch('/api/courses/chapters/getUser/').then((x) => x.json());
});

const setThemeCookieFn = $(async (themeValue: any) => {
  const d = new FormData();
  d.append('theme', themeValue);
  return await fetch('/api/courses/chapters/setThemeCookie/', {
    method: 'POST',
    body: d,
    // headers: {
    //   'Content-Type': 'application/json',
    // },
  }).then((x) => x.json());
});

const logout = $(() => {
  return fetch('/api/courses/logout/', {
    method: 'POST',
  });
});

// export const sc = $((deltaY: number, scrollDir: Signal<number>, scroller: Signal<any>) => {
//   if (deltaY < 0) {
//     if (scrollDir.value > 0) (window as any).smoothScroll.stopAll();
//     scrollDir.value = -1;
//     if ((window as any).smoothScroll.scrolling()) return;
//     scroller.value.smoothScroll({ yPos: '-200' });
//   } else {
//     if (scrollDir.value < 0) (window as any).smoothScroll.stopAll();
//     scrollDir.value = 1;
//     if ((window as any).smoothScroll.scrolling()) return;
//     scroller.value.smoothScroll({ yPos: '+200' });
//   }
// });

export default component$(() => {
  const parentEl = useSignal<HTMLDivElement>();
  const game = useSignal<NoSerialize<Phaser.Game> | null>(null);
  const scroller = useSignal<any>();
  const scrollDir = useSignal(0);

  const stage = useSignal('enterFrom');

  const largeSprite = useStore<NoSerialize<Phaser.Physics.Matter.Sprite>[]>([]);
  const mediumSprite = useStore<NoSerialize<Phaser.Physics.Matter.Sprite>[]>([]);
  const smallSprite = useStore<NoSerialize<Phaser.Physics.Matter.Sprite>[]>([]);

  const user = useSignal<LuciaSession['user']>();

  const debounce = useDebouncer(
    $((fn: Function) => {
      fn();
    }),
    500
  );

  const blast = $(() => {
    largeSprite.forEach((sprite) => {
      if (!sprite) return;
      sprite.setAngularVelocity(Math.min(0.35, Math.random()));
      sprite.setVelocity((Math.random() < 0.5 ? -1 : 1) * Math.random() * 50, Math.random() * 50);
    });
    mediumSprite.forEach((sprite) => {
      if (!sprite) return;
      sprite.setAngularVelocity(Math.min(0.35, Math.random()));
      sprite.setVelocity((Math.random() < 0.5 ? -1 : 1) * Math.random() * 50, Math.random() * 50);
    });
    smallSprite.forEach((sprite) => {
      if (!sprite) return;
      sprite.setAngularVelocity(Math.min(0.35, Math.random()));
      sprite.setVelocity((Math.random() < 0.5 ? -1 : 1) * Math.random() * 50, Math.random() * 50);
    });
  });

  useVisibleTask$(({ track }) => {
    track(() => parentEl.value);
    if (!parentEl.value || game.value) return;
    if (window.innerWidth < 768) return;
    const randomize = (max: number) => {
      return Math.floor(Math.random() * max);
    };
    // scroller.value = noSerialize(new (window as any).smoothScroll({ duration: 100, allowAnimationOverlap: false }));
    let newGame: Phaser.Game;
    const phaserScript = document.createElement('script');
    phaserScript.setAttribute('src', '/phaser.min.js');
    phaserScript.onload = () => {
      stage.value = 'enterTo';
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
          // this.input.on('wheel', (e: WheelEvent) => {
          // sc(e.deltaY, scrollDir, scroller);
          // });
          const shapes = this.cache.json.get('shapes');
          this.matter.world.setBounds(0, 0, parentEl.value!.offsetWidth, parentEl.value!.offsetHeight);
          largeSprite.push(
            noSerialize(
              this.matter.add
                .sprite(randomize(parentEl.value!.offsetWidth), 0, 'sheet', 'small_css.png', {
                  shape: shapes.small_css,
                })
                .setInteractive()
            )
          );
          largeSprite.push(
            noSerialize(
              this.matter.add
                .sprite(randomize(parentEl.value!.offsetWidth), 0, 'sheet', 'small_js.png', { shape: shapes.small_js })
                .setInteractive()
            )
          );
          largeSprite.push(
            noSerialize(
              this.matter.add
                .sprite(randomize(parentEl.value!.offsetWidth), 0, 'sheet', 'small_html.png', {
                  shape: shapes.small_html,
                })
                .setInteractive()
            )
          );
          largeSprite.push(
            noSerialize(
              this.matter.add
                .sprite(randomize(parentEl.value!.offsetWidth), 0, 'sheet', 'batch_react.png', {
                  shape: shapes.batch_react,
                })
                .setInteractive()
            )
          );
          largeSprite.push(
            noSerialize(
              this.matter.add
                .sprite(randomize(parentEl.value!.offsetWidth), 0, 'sheet', 'batch_nextjs.png', {
                  shape: shapes.batch_nextjs,
                })
                .setInteractive()
            )
          );
          largeSprite.push(
            noSerialize(
              this.matter.add
                .sprite(randomize(parentEl.value!.offsetWidth), 0, 'sheet', 'batch_qwik.png', {
                  shape: shapes.batch_qwik,
                })
                .setInteractive()
            )
          );
          mediumSprite.push(
            noSerialize(
              this.matter.add
                .sprite(randomize(parentEl.value!.offsetWidth), 0, 'sheet', 'batch_sublime.png', {
                  shape: shapes.batch_sublime,
                })
                .setInteractive()
            )
          );
          mediumSprite.push(
            noSerialize(
              this.matter.add
                .sprite(randomize(parentEl.value!.offsetWidth), 0, 'sheet', 'batch_vscode.png', {
                  shape: shapes.batch_vscode,
                })
                .setInteractive()
            )
          );
          mediumSprite.push(
            noSerialize(
              this.matter.add
                .sprite(randomize(parentEl.value!.offsetWidth), 0, 'sheet', 'batch_intellij.png', {
                  shape: shapes.batch_intellij,
                })
                .setInteractive()
            )
          );
          mediumSprite.push(
            noSerialize(
              this.matter.add
                .sprite(randomize(parentEl.value!.offsetWidth), 0, 'sheet', 'batch_neovim.png', {
                  shape: shapes.batch_neovim,
                })
                .setInteractive()
            )
          );
          for (let i = 0; i < 10; i++) {
            smallSprite.push(
              noSerialize(
                this.matter.add
                  .sprite(randomize(parentEl.value!.offsetWidth), 0, 'sheet', 'batch_gray_circle.png', {
                    shape: shapes.batch_gray_circle,
                  })
                  .setInteractive()
              )
            );
            smallSprite.push(
              noSerialize(
                this.matter.add
                  .sprite(randomize(parentEl.value!.offsetWidth), 0, 'sheet', 'gray_square.png', {
                    shape: shapes.gray_square,
                  })
                  .setInteractive()
              )
            );
          }
          largeSprite.forEach((sprite) => {
            if (!sprite) return;
            this.input.setDraggable(sprite, true);
            sprite.displayWidth = 80;
            sprite.displayHeight = 80;
            sprite.setAngularVelocity(Math.min(0.35, Math.random()));
            sprite.setVelocity((Math.random() < 0.5 ? -1 : 1) * Math.random() * 20, Math.random() * 10);
          });
          mediumSprite.forEach((sprite) => {
            if (!sprite) return;
            this.input.setDraggable(sprite, true);
            sprite.displayWidth = 50;
            sprite.displayHeight = 50;
            sprite.setAngularVelocity(Math.min(0.35, Math.random()));
            sprite.setVelocity((Math.random() < 0.5 ? -1 : 1) * Math.random() * 20, Math.random() * 10);
          });
          smallSprite.forEach((sprite) => {
            if (!sprite) return;
            this.input.setDraggable(sprite, true);
            sprite.displayWidth = 15;
            sprite.displayHeight = 15;
            sprite.setAngularVelocity(Math.min(0.35, Math.random()));
            sprite.setVelocity((Math.random() < 0.5 ? -1 : 1) * Math.random() * 20, Math.random() * 10);
          });
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
            // debug: true,
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
      newGame.destroy(true, true);
    };
  });

  // useOnDocument("wheel", $((e: WheelEvent) => {
  //   e.preventDefault();
  //   sc(e.deltaY, scrollDir, scroller);
  // }))

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
          );
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
    <div
      id="swup"
      class="relative h-[100dvh] w-full overflow-x-hidden"
      // onWheel$={(e: WheelEvent) => {
      //   console.log("yo");
      //   e.preventDefault();
      //   if ((window as any).smoothScroll.scrolling()) return;
      //   if (e.deltaY < 0) {
      //     (window as any).smoothScroll({ yPos: 0, duration: 500, easing: 'easeOutSine' });
      //   } else {
      //     (window as any).smoothScroll({ yPos: window.innerHeight + 50, duration: 200, easing: 'linear' });
      //   }
      // }}
    >
      <div class="absolute top-0 z-[100] block w-full lg:hidden">
        <Nav2 getUserFn={getUserFn} setThemeCookieFn={setThemeCookieFn} logoutFn={logout} />
      </div>
      <div class="absolute top-0 w-full hidden lg:block">
        <Nav user={user.value} />
      </div>
      <div class="h-full w-full overflow-hidden">
        <FollowerPointerCard client:visible className="relative h-full" title="Partialty.com">
          <button
            onClick$={blast}
            class={cn(
              'swup-main absolute left-8 top-[15%] z-[50] hidden cursor-none flex-col items-center justify-center md:flex lg:bottom-[15%] lg:left-24 lg:top-[unset]',
              stage.value === 'enterFrom' && 'is-animating2',
              stage.value === 'enterTo' && 'is-animating2 appear'
            )}
          >
            <img
              src={BlastPNG}
              alt="Blast"
              width="40"
              height="40"
              class="size-[30px] object-contain transition-all duration-500 hover:size-[40px] lg:size-[40px] lg:hover:size-[50px]"
            />
            <span class="text-xs italic text-[#CC5DE8]">Blast</span>
          </button>

          <div class="absolute left-[50%] top-[50%] z-[50] translate-x-[-50%] translate-y-[-50%]">
            <Center />
          </div>
        </FollowerPointerCard>
      </div>
      <div ref={parentEl} class="absolute top-0 z-10 hidden h-full w-full bg-red-500 bg-transparent md:block "></div>
    </div>
  );
});
