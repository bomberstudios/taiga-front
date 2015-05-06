describe "navigationBarDirective", () ->
    scope = compile = provide = null
    mockTgProjectsService = null
    template = "<div tg-navigation-bar></div>"
    recents = []

    createDirective = () ->
        elm = compile(template)(scope)
        return elm

    _mockTgProjectsService = () ->
        mockTgProjectsService = {
            newProject: sinon.stub()
            projects: {
                get: sinon.stub()
            }
        }
        provide.value "tgProjectsService", mockTgProjectsService

    _mockTranslateFilter = () ->
        mockTranslateFilter = (value) ->
            return value
        provide.value "translateFilter", mockTranslateFilter

    _mockTgDropdownProjectListDirective = () ->
        provide.factory 'tgDropdownProjectListDirective', () -> {}

    _mockTgDropdownUserDirective = () ->
        provide.factory 'tgDropdownUserDirective', () -> {}

    _mocks = () ->
        module ($provide) ->
            provide = $provide
            _mockTgProjectsService()
            _mockTranslateFilter()
            _mockTgDropdownProjectListDirective()
            _mockTgDropdownUserDirective()
            return null

    beforeEach ->
        module "templates"
        module "taigaNavigationBar"

        _mocks()

        inject ($rootScope, $compile) ->
            scope = $rootScope.$new()
            compile = $compile

        recents = Immutable.fromJS([
            {
                id:1
            },
            {
                id: 2
            }
        ])

    it "navigation bar directive scope content", () ->
        mockTgProjectsService.projects.get
            .withArgs("recents")
            .returns(recents)

        elm = createDirective()
        scope.$apply()
        expect(elm.isolateScope().vm.projects.size).to.be.equal(2)
