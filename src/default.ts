import version from './version?text';
import find from './find';
import Default from '.default';
export default Default(find, {
	version,
	find,
});