import { shallow } from 'enzyme';
import * as React from 'react';

import [FTName % pascalcase] from './[FTName % pascalcase]';

describe(' [FTName % lowercase] specs', () => {
  it('should render as expected when passing required properties', () => {
    // Act
    const component = shallow(<[FTName % pascalcase] />);

    // Assert
    expect(component).toMatchSnapshot();
  });
});
