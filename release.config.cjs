/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
	branches: [
		'main',
		{
			name: 'next',
			prerelease: true,
			channel: 'next'
		}
	],
	plugins: [
		'@semantic-release/commit-analyzer',
		'@semantic-release/release-notes-generator',
		'@semantic-release/npm',
		'@semantic-release/github',
		'@semantic-release/changelog',
		[
			'@semantic-release/git',
			{
				assets: ['package.json', 'package-lock.json', 'CHANGELOG.md'],
				message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
			}
		]
	]
};
