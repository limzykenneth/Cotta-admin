<template>
	<section id="page-content">
		<component
			v-bind:is="currentView"
		/>
	</section>
</template>

<script>
import Dashboard from "./ContentDashboard.vue";
import LoginPage from "./ContentLogin.vue";
import SignupPage from "./ContentSignup.vue";
import CollectionList from "./ContentCollectionList.vue";
import SchemasList from "./ContentSchemasList.vue";
import SchemasEdit from "./ContentSchemasEdit.vue";
import UsersList from "./ContentUsersList.vue";
import UserEdit from "./ContentUserEdit.vue";
import UserPage from "./ContentUser.vue";
import ModelPage from "./ContentModel.vue";
import ModelEdit from "./ContentModelEdit.vue";
import AccountPage from "./ContentAccount.vue";
import SettingsPage from "./ContentSettings.vue";
import FilesPage from "./ContentFiles.vue";

export default {
	name: "AppContent",
	components: {
		"app-dashboard": Dashboard,
		"login-page": LoginPage,
		"signup-page": SignupPage,
		"collection-list": CollectionList,
		"schemas-list": SchemasList,
		"schemas-edit": SchemasEdit,
		"users-list": UsersList,
		"user-edit": UserEdit,
		"user-page": UserPage,
		"model-page": ModelPage,
		"model-edit": ModelEdit,
		"account-page": AccountPage,
		"settings-page": SettingsPage,
		"files-page": FilesPage
	},
	computed: {
		currentView: function(){
			return this.$store.state.currentContentView;
		}
	}
};
</script>

<style lang="less" scoped>
	@import "../assets/stylesheets/mixins.less";

	#page-content{
		flex-grow: 2;
		width: ~"calc(100vw - 200px)";
		padding: 20px;
		overflow: scroll;
	}
</style>