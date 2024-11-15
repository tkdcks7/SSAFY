interface CFIComponent {
  steps: Array<{index: number; id: string | null}>;
  offset: number | null;
}

function parseComponent(componentStr: string): CFIComponent {
  const component: CFIComponent = {steps: [], offset: null};

  const [stepsStr, offsetStr] = componentStr.split(':');
  const steps = stepsStr.split('/').filter(Boolean);

  component.steps = steps.map(step => {
    const match = step.match(/(\d+)(?:\[(.+?)\])?/);
    if (!match) throw new Error('Invalid step format');
    const index = parseInt(match[1], 10);
    const id = match[2] || null;
    return {index, id};
  });

  if (offsetStr) {
    component.offset = parseInt(offsetStr, 10);
  }

  return component;
}

export const compareCFIStrings = (cfiOne: string, cfiTwo: string): number => {
  const cfiPattern = /^epubcfi\((.+?)!(.+?)\)$/;
  const matchOne = cfiPattern.exec(cfiOne);
  const matchTwo = cfiPattern.exec(cfiTwo);

  if (!matchOne || !matchTwo) throw new Error('Invalid CFI format');

  const [_, spineOneStr, pathOneStr] = matchOne;
  const [__, spineTwoStr, pathTwoStr] = matchTwo;

  // Parse spine positions
  const spineOne = parseComponent(spineOneStr);
  const spineTwo = parseComponent(spineTwoStr);

  // Compare spine positions
  for (let i = 0; i < spineOne.steps.length; i++) {
    if (!spineTwo.steps[i]) return 1; // cfiTwo is shorter
    if (spineOne.steps[i].index > spineTwo.steps[i].index) return 1;
    if (spineOne.steps[i].index < spineTwo.steps[i].index) return -1;
  }
  if (spineOne.steps.length < spineTwo.steps.length) return -1;

  // Parse path positions
  const pathOne = parseComponent(pathOneStr);
  const pathTwo = parseComponent(pathTwoStr);

  // Compare path positions
  for (let i = 0; i < pathOne.steps.length; i++) {
    if (!pathTwo.steps[i]) return 1;
    if (pathOne.steps[i].index > pathTwo.steps[i].index) return 1;
    if (pathOne.steps[i].index < pathTwo.steps[i].index) return -1;
  }
  if (pathOne.steps.length < pathTwo.steps.length) return -1;

  // Compare offsets
  if ((pathOne.offset ?? 0) > (pathTwo.offset ?? 0)) return 1;
  if ((pathOne.offset ?? 0) < (pathTwo.offset ?? 0)) return -1;

  // CFIs are equal
  return 0;
};
