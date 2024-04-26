/** @jsxImportSource react */
import { qwikify$ } from '@builder.io/qwik-react';

import { useEffect, useRef, useState } from 'react';

const phaser = () => {
  const parentEl = useRef<HTMLDivElement>(null);
  const [game, setGame] = useState<any>(null);

  useEffect(() => {
    if (!parentEl.current || game) return;
    let newGame: any;
    const phaserScript = document.createElement('script');
    phaserScript.setAttribute('src', '/phaser.min.js');
    phaserScript.onload = () => {
      class Scene1 extends (window as any).Phaser.scene {
        constructor() {
          super('bootGame');
        }
        init() {
          console.log('init');
        }
        preload() {
          console.log('preload');
          // (this as any).load.atlas('sheet', '/2d_assets/css.png', '/2d_assets/css.json');

          // Load body shapes from JSON file generated using PhysicsEditor
          // (this as any).load.json('shapes', '/2d_assets/css.json');

          this.load.image('sky', '2d_assets/css.png');
        }
        create() {
          console.log('create');
          const shapes = this.cache.json.get('shapes');
          this.add.image(400, 300, 'sky');
          // this.matter.world.setBounds(0, 0, game.config.width, game.config.height);
          // this.matter.add.sprite(200, 50, 'sheet', 'crate', {shape: shapes.crate});
          console.log('shapes', shapes);
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
        type: (window as any).Phaser.AUTO,
        parent: parentEl.current,
        width: parentEl.current!.offsetWidth,
        height: parentEl.current!.offsetHeight,
      });

      
      setGame(newGame);
    };
    document.body.append(phaserScript);
    return () => {
      newGame?.destroy(true, true);
    };
  }, [parentEl.current]);

  return <div ref={parentEl} className="h-screen w-full" />;
};

export default qwikify$(phaser);
