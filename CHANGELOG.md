# [1.0.0-beta.26](https://github.com/ajyey/masked-email-manager/compare/v1.0.0-beta.25...v1.0.0-beta.26) (2023-06-26)


### Bug Fixes

* add fixed width for email items ([d467f92](https://github.com/ajyey/masked-email-manager/commit/d467f927593237db30ee95f4adcb6be4684218cb))


### Features

* add a no email selected component that shows in the detail pane ([7bf520e](https://github.com/ajyey/masked-email-manager/commit/7bf520eece7b296491c57b6d0b142fe028cc2556))
* add components for lastMessageAt and createdAt ([b1e3ce7](https://github.com/ajyey/masked-email-manager/commit/b1e3ce7edea4bd3527943c6f5ca722fc74963849))

# [1.0.0-beta.25](https://github.com/ajyey/masked-email-manager/compare/v1.0.0-beta.24...v1.0.0-beta.25) (2023-06-24)


### Features

* add email enable/disable functionality ([0410a6e](https://github.com/ajyey/masked-email-manager/commit/0410a6e34bce0f719a199a186a4a591fd375b24f))
* add support for setting the toggle based on the email state ([048cd0b](https://github.com/ajyey/masked-email-manager/commit/048cd0bd52866493c6f192dca5decbb9758d6f78))
* update effect deps so unfavorited emails are removed ([1c6aa4f](https://github.com/ajyey/masked-email-manager/commit/1c6aa4f5ab33c2a11762f443ebf7574dc80132f1))

# [1.0.0-beta.24](https://github.com/ajyey/masked-email-manager/compare/v1.0.0-beta.23...v1.0.0-beta.24) (2023-06-24)


### Features

* add cancel button to exit editing mode ([806bd7e](https://github.com/ajyey/masked-email-manager/commit/806bd7e27e128499630e07edb2a0be8ef1321503))
* add initial email state toggle ([c121cca](https://github.com/ajyey/masked-email-manager/commit/c121cca31f5ce9e55ff31e794e16713f1a3b87cf))
* add support for copying each email item detail to the clipboard ([09a4751](https://github.com/ajyey/masked-email-manager/commit/09a475133188ac9fb5c9c3689fea077f4c0b020b))
* only show the enable/disable toggle if the user is not editing ([a710943](https://github.com/ajyey/masked-email-manager/commit/a710943714d95ec5d7b2ff084f6d6a71985d90dc))
* only update email on save after editing if the user made changes ([89d8900](https://github.com/ajyey/masked-email-manager/commit/89d8900e6d5490515c3ea4c447e9b59d2dd8486e))

# [1.0.0-beta.23](https://github.com/ajyey/masked-email-manager/compare/v1.0.0-beta.22...v1.0.0-beta.23) (2023-06-24)


### Features

* add support for saving changes to an email's domain and description ([b15433d](https://github.com/ajyey/masked-email-manager/commit/b15433de4cb78634f369b3a5bc53122114ce9ad2))
* dynamically add edit icon next to editable fields when the user is editing ([68bd194](https://github.com/ajyey/masked-email-manager/commit/68bd19483c891fd84bc984c52a168367ef8b0d06))
* only select the first email by default in certain situations ([fef3bfc](https://github.com/ajyey/masked-email-manager/commit/fef3bfc6605ee5be66743b51d353b8a7a1a6553e))
* remove outline when input is active for domain and description ([cd9f36f](https://github.com/ajyey/masked-email-manager/commit/cd9f36f2ae2166c32863baf727597bc8a778440c))
* show loading component in details section while isLoading ([75488ba](https://github.com/ajyey/masked-email-manager/commit/75488baf549b39bd3ff436dc6feab6eef8b6a1b6))
* update outline of email details when the user is editing ([8225fdc](https://github.com/ajyey/masked-email-manager/commit/8225fdc6ca2f854203b6afe30f1415a615ebac7a))

# [1.0.0-beta.22](https://github.com/ajyey/masked-email-manager/compare/v1.0.0-beta.21...v1.0.0-beta.22) (2023-06-23)


### Features

* add bottom margin to each detail value ([84afd78](https://github.com/ajyey/masked-email-manager/commit/84afd7829fde0082b9853b35c322fcd62577419c))
* add initial editing functionality to email details ([73f62fc](https://github.com/ajyey/masked-email-manager/commit/73f62fc20d6c89deeed1b97603d4bb9ba574b857))

# [1.0.0-beta.21](https://github.com/ajyey/masked-email-manager/compare/v1.0.0-beta.20...v1.0.0-beta.21) (2023-06-23)


### Features

* add EmailAddress, EmailDescription, EmailDomain and EmailId components for email detail ([4c00994](https://github.com/ajyey/masked-email-manager/commit/4c009940e558d9add82e58a65de04c03541b5679))
* add zip command to build script for testing in firefox ([20d19ef](https://github.com/ajyey/masked-email-manager/commit/20d19efda87e7c4ce431bfa7686802aee5da94df))

# [1.0.0-beta.20](https://github.com/ajyey/masked-email-manager/compare/v1.0.0-beta.19...v1.0.0-beta.20) (2023-06-23)


### Bug Fixes

* make email count text small for cross browser consistency ([c994b6d](https://github.com/ajyey/masked-email-manager/commit/c994b6dcabafa4046eb9de9026e0bdf4ab29c2fb))


### Features

* add Firefox support to build process ([c7f1201](https://github.com/ajyey/masked-email-manager/commit/c7f1201493cfef3a22853ea5b19b1977241d7d3b))
* add scrollbar css styling for firefox ([041dc4b](https://github.com/ajyey/masked-email-manager/commit/041dc4b7fd4fcb07cbb31014eb34bb772dec912f))
* use web extension polyfill in preparation for supporting multiple browsers ([e5b49df](https://github.com/ajyey/masked-email-manager/commit/e5b49df93891a7171ccbf09faf60b33f307c8795))

# [1.0.0-beta.19](https://github.com/ajyey/masked-email-manager/compare/v1.0.0-beta.18...v1.0.0-beta.19) (2023-06-22)


### Features

* set favorited to be the default (top) option in the dropdown ([97e7944](https://github.com/ajyey/masked-email-manager/commit/97e79447667cacd8f664c3c954c940d63cc43dfd))

# [1.0.0-beta.18](https://github.com/ajyey/masked-email-manager/compare/v1.0.0-beta.17...v1.0.0-beta.18) (2023-06-22)


### Bug Fixes

* bug where the favorite icon would appear favorited even when there are no search results ([a28aa56](https://github.com/ajyey/masked-email-manager/commit/a28aa568a74e9a29782922f7ef8df953b4391229))


### Features

* add basic favorite email functionality ([c5db78c](https://github.com/ajyey/masked-email-manager/commit/c5db78c3f40e03aee71a87d3dfbe4677bd29a676))
* add initial dropdown for favorited emails ([8d8d0c1](https://github.com/ajyey/masked-email-manager/commit/8d8d0c1e12a161880b39bfc60ec972f42eaa4799))
* add initial Edit and Favorite buttons to Email Detail Pane ([540a9dc](https://github.com/ajyey/masked-email-manager/commit/540a9dc4a8ab232f22b8f299d2968dffb8f4db82))

# [1.0.0-beta.17](https://github.com/ajyey/masked-email-manager/compare/v1.0.0-beta.16...v1.0.0-beta.17) (2023-06-22)


### Features

* **emails:** add ability to select an email ([66414c1](https://github.com/ajyey/masked-email-manager/commit/66414c1c93ea9847ceb7da62d29fceb601f3053c))
* add constant for Fastmail session key and only store the session ([a87458c](https://github.com/ajyey/masked-email-manager/commit/a87458cd8e64e5c220084ec986ed320cbeec2ade))

# [1.0.0-beta.16](https://github.com/ajyey/masked-email-manager/compare/v1.0.0-beta.15...v1.0.0-beta.16) (2023-06-21)


### Bug Fixes

* css and missing onchange handler for token input ([3d43512](https://github.com/ajyey/masked-email-manager/commit/3d43512dab526002f11b465688619f05ab7468c7))
* form submission for login component by useing e.prevent default ([340f8a7](https://github.com/ajyey/masked-email-manager/commit/340f8a7a26a522aa11fbe2fa2428232c96f7b14b))


### Features

* add ability to login and be navigated to home ([59e0f77](https://github.com/ajyey/masked-email-manager/commit/59e0f775e81977417a81d8fa3c4bfea01cfa80de))
* wip - make login component better ([c242d73](https://github.com/ajyey/masked-email-manager/commit/c242d735b305483325f0771865febb74ac1eeebc))

# [1.0.0-beta.15](https://github.com/ajyey/masked-email-manager/compare/v1.0.0-beta.14...v1.0.0-beta.15) (2023-06-21)


### Bug Fixes

* improve styling for email item ([8f59c40](https://github.com/ajyey/masked-email-manager/commit/8f59c4047067d6867ead98fb603877a19a746c94))


### Features

* add EmailCount component and track filtered emails count ([a1aba76](https://github.com/ajyey/masked-email-manager/commit/a1aba76f8e02d677ddc0129d95f0dcd53fafd215))
* add iconClasses prop to Icon components ([5a1a272](https://github.com/ajyey/masked-email-manager/commit/5a1a272501d8d7042bbd7674e4de9c39a62723c4))

# [1.0.0-beta.14](https://github.com/ajyey/masked-email-manager/compare/v1.0.0-beta.13...v1.0.0-beta.14) (2023-06-21)

# [1.0.0-beta.13](https://github.com/ajyey/masked-email-manager/compare/v1.0.0-beta.12...v1.0.0-beta.13) (2023-06-21)


### Features

* close the dropdown menu when the user clicks anywhere outside of it ([b825322](https://github.com/ajyey/masked-email-manager/commit/b8253229c0d526ec2b500cec833bd5a16d94b2e5))

# [1.0.0-beta.12](https://github.com/ajyey/masked-email-manager/compare/v1.0.0-beta.11...v1.0.0-beta.12) (2023-06-21)


### Features

* add extended search functionality to EmailList ([abdbb13](https://github.com/ajyey/masked-email-manager/commit/abdbb13be169409abe1300aa27be0dbb64d0adaf))

# [1.0.0-beta.11](https://github.com/ajyey/masked-email-manager/compare/v1.0.0-beta.10...v1.0.0-beta.11) (2023-06-21)


### Bug Fixes

* add checkmark back in for selected dropdown option ([979dcf4](https://github.com/ajyey/masked-email-manager/commit/979dcf49cf555b69b9ebcf38b7a1883950c9d234))


### Features

* **filter:** add ability for dropdown icons to be present in the dropdown button ([6b7fd46](https://github.com/ajyey/masked-email-manager/commit/6b7fd46d0e3746855d545d0b433bba9b8dd2e29d))
* add refresh button to TopComponent for refreshing the list of emails ([9ef99c7](https://github.com/ajyey/masked-email-manager/commit/9ef99c7a1792fc35e2aaa6b586884aa88888917a))

# [1.0.0-beta.10](https://github.com/ajyey/masked-email-manager/compare/v1.0.0-beta.9...v1.0.0-beta.10) (2023-06-21)


### Features

* improve filter dropdown UI ([46ce3e7](https://github.com/ajyey/masked-email-manager/commit/46ce3e7d07cdc6f895714edabf99ee7f9639ea06))

# [1.0.0-beta.9](https://github.com/ajyey/masked-email-manager/compare/v1.0.0-beta.8...v1.0.0-beta.9) (2023-06-21)


### Features

* add SVG icons to filter dropdown items ([1ada99a](https://github.com/ajyey/masked-email-manager/commit/1ada99a5cc27d00ca6494f2da6e45f665d890c5d))

# [1.0.0-beta.8](https://github.com/ajyey/masked-email-manager/compare/v1.0.0-beta.7...v1.0.0-beta.8) (2023-06-21)


### Features

* add "All" option to email filter dropdown ([2d5a3af](https://github.com/ajyey/masked-email-manager/commit/2d5a3afc7a99c1e78d0b949991693ef2e9980d57))
* add email filtering functionality ([c2d03e0](https://github.com/ajyey/masked-email-manager/commit/c2d03e0e65e9e0064990b164cf83ae8f8863fa9f))
* add fuzzy search functionality ([b33e89e](https://github.com/ajyey/masked-email-manager/commit/b33e89ef9e272728726eb18db1d451f0ba48f6b6))
* add search query state and clear button for clearing search bar ([0ab6598](https://github.com/ajyey/masked-email-manager/commit/0ab65988f36c2cf61d531cf1e8d101c7e9fb6a7f))
* update FilterEmailsDropdown and tailwind.config ([b41c2cc](https://github.com/ajyey/masked-email-manager/commit/b41c2cc64bffa8d3aef9a0bf130fbf510f4df185))

# [1.0.0-beta.7](https://github.com/ajyey/masked-email-manager/compare/v1.0.0-beta.6...v1.0.0-beta.7) (2023-06-20)


### Features

* **filter:** add checkmark icon to selected option ([c8fdeac](https://github.com/ajyey/masked-email-manager/commit/c8fdeacc14eccc1d85be227262b6739b4068ebc5))
* wip - add better dropdown styling ([682b5d9](https://github.com/ajyey/masked-email-manager/commit/682b5d9a91feb11202329b2c0dcce62670433b1a))
* wip adds initial filter dropdown structure ([b93d30c](https://github.com/ajyey/masked-email-manager/commit/b93d30cc55a3d58cd3f48322a7e35511efedc8d2))
* wip manually align the filter dropdown to center ([6104f2a](https://github.com/ajyey/masked-email-manager/commit/6104f2aa60b9808f08a798dccf6a104b2b935a7b))

# [1.0.0-beta.6](https://github.com/ajyey/masked-email-manager/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2023-06-20)


### Features

* add custom scrollbar and fix some layout issues ([4d7b7b7](https://github.com/ajyey/masked-email-manager/commit/4d7b7b70f8ad87637b49d38816a8b6e977bca980))

# [1.0.0-beta.5](https://github.com/ajyey/masked-email-manager/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2023-06-20)


### Bug Fixes

* dynamically add semantic-release chrome plugin ([12481e3](https://github.com/ajyey/masked-email-manager/commit/12481e3e74aa5418c4d088de8489d8cecf6b41a3))
* top component border added to parent element ([2791548](https://github.com/ajyey/masked-email-manager/commit/2791548ebad1aade383375c182aeac4b94f44eab))


### Features

* add loading component ([a8a72f4](https://github.com/ajyey/masked-email-manager/commit/a8a72f4238db4a43c7fbb79665022c61d4f350dd))
* add MaskedEmailListItem component and update MaskedEmailListPane ([0b3f8e4](https://github.com/ajyey/masked-email-manager/commit/0b3f8e48232800b7c9634d29d709b54db29e6874))
* remove focus outline from search input ([e385fa7](https://github.com/ajyey/masked-email-manager/commit/e385fa72129337db5d655bbe0b44bf58b739fa10))

# [1.0.0-beta.4](https://github.com/ajyey/masked-email-manager/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2023-06-20)


### Features

* add link to GitHub repository in Top component ([24614f4](https://github.com/ajyey/masked-email-manager/commit/24614f4807ad21549b91e189482e8c66b1115dbd))

# [1.0.0-beta.3](https://github.com/ajyey/masked-email-manager/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2023-06-20)


### Features

* add ability to save Fastmail API token to Chrome storage on submit ([32e9c1a](https://github.com/ajyey/masked-email-manager/commit/32e9c1a760d0278a15edb6b3033594c02514d07b))
* add bottom border to top component ([d660aca](https://github.com/ajyey/masked-email-manager/commit/d660aca9197fdcb48938cd80ae7669ede2efe334))
* add console log to background script and update login component ([63ba16b](https://github.com/ajyey/masked-email-manager/commit/63ba16b0666a76bbf3d2ef9459f418a7877f1fce))
* add fastmail session storage on login ([7af5c9e](https://github.com/ajyey/masked-email-manager/commit/7af5c9eba2974d4b5dc73d5cd51ba09487b182b1))
* add initial login component ([cc15b08](https://github.com/ajyey/masked-email-manager/commit/cc15b08765bac20f2d8fb35d4b0b919e25f3b573))
* add initial UI for home's top component ([d1abac3](https://github.com/ajyey/masked-email-manager/commit/d1abac32c8e23670d6d56d4b7a6155905c36e917))
* add MaskedEmailListPane and MaskedEmailDetailPane components ([44380a3](https://github.com/ajyey/masked-email-manager/commit/44380a369222121d31bbed882fc6e1d1bc4cadeb))
* add new fastmail colors to tailwind.config ([249ac81](https://github.com/ajyey/masked-email-manager/commit/249ac81edf1574ab4f36399473518f3348415cba))
* add storage to permissions in manifest ([e868882](https://github.com/ajyey/masked-email-manager/commit/e868882aad06139949353db87fec8c13b3121def))
* adjust height and width of Home component ([dd0969c](https://github.com/ajyey/masked-email-manager/commit/dd0969ce0fdaa2a30beed05796cacd387e0783c4))
* check if user is authenticated and pass that status into popup as a prop ([ea061e5](https://github.com/ajyey/masked-email-manager/commit/ea061e5f8a512a998a789377621565fce673b6f9))
* conditionally render home or login component ([3883466](https://github.com/ajyey/masked-email-manager/commit/3883466b99def8211b036b2c22f03934ab82a894))
* improve UI of TopComponent ([d967ba8](https://github.com/ajyey/masked-email-manager/commit/d967ba89a6644ec87d4a4b7b8a68e8897ebd019c))

# [1.0.0-beta.2](https://github.com/ajyey/masked-email-manager/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2023-06-17)


### Bug Fixes

* make popup window larger ([8eb981b](https://github.com/ajyey/masked-email-manager/commit/8eb981bf2ce235b2bb30395244d3e1640482f53a))

# 1.0.0-beta.1 (2023-06-17)


### Features

* add masked email logo assets ([39daac8](https://github.com/ajyey/masked-email-manager/commit/39daac83a59d4231beb1e56d93249bcb590bf5d4))
