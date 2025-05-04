import { CineforgeEngine } from './CineforgeEngine';

describe('CineforgeEngine', () => {
  it('can instantiate and destroy', () => {
    const div = document.createElement('div');
    const engine = new CineforgeEngine(div);
    expect(engine).toBeInstanceOf(CineforgeEngine);
    engine.destroy();
    expect(engine).not.toBeNull();
  });
});