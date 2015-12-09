var connection = require('../../../persistent/connection.js');
var userProxy = require('../../../persistent/proxy/user');

describe('persistent/model', function () {
  before(function () {
    return connection.connect();
  });

  describe('#User', function () {

    it('User.remove() should be able to clear all the user user data and return a fulfilled promise', function () {
      return User.remove().exec();
    });

    var user1 = new User({
      '_id': '54ae4e2850c6e49025a8cd7f',
      'name': '刘备',
      'status': '创业中',
      'description': '我是一个创业者，目标是匡扶汉室',
      'location': '四川',
      'filed': '皇帝',
      'tags': ['java', 'nodejs', 'app开发'],
      'projects': [],
      'archived_projects': [],
      'education': [
        {
          'period': {
            'from': 2004,
            'to': 2007
          },
          'school': '私塾',
          'desc': '念过几年书'
        },
        {
          'period': {
            'from': 2004,
            'to': 2000
          },
          'school': '私塾',
          'desc': '念过几年书'
        }
      ],
      'startups': [
        // {
        //  'period':{
        //    'from':2004,
        //    'to': 2007
        //  },
        //  'projects':'no1',
        //  'desc':'项目1'
        // },
        // {
        //  'period':{
        //    'from':2004,
        //    'to': 2007
        //  },
        //  'projects':'no1',
        //  'desc':'项目2'
        // }
      ],
      'works': [
        {
          'period': {
            'from': 0184,
            'to': 0184
          },
          'corp': '安喜县县尉',
          'desc': '公元184年（汉灵帝中平元年），爆发黄巾起义，23岁的刘备因镇压起义军有功被封为安喜县县尉'
        },
        {
          'period': {
            'from': 0191,
            'to': 0191
          },
          'corp': '平原县县令',
          'desc': '刘备与青州刺史田楷一起对抗冀州牧袁绍，刘备因为累次建立功勋而升为试守平原县县令，后领平原国相'
        }
      ],
      'follows': {
        'projects': [/*'pid0', 'pid1', 'pid2'*/],
        'person': [/*'user0','user1','user2'*/]
      },
      'fans': [/*'user3','user4','user5'*/],
      'friends': [/*'user0','user1','user2'*/]
    });
    it('User.create() should be able to save the data to DB and return a fulfilled promise', function () {
      return User.create(user1).should.be.fulfilled;
    });

    var user2 = new User({
      '_id': '54ae4e6756bb829820ee1bde',
      'name': '诸葛亮',
      'status': '在职',
      'description': '我是一个在职员工，正在需求创业项目',
      'location': '北京',
      'filed': '谋略',
      'tags': ['java', 'nodejs', 'app开发'],
      'projects': [],
      'archived_projects': [],
      'education': [
        {
          'period': {
            'from': 2004,
            'to': 2007
          },
          'school': '茅庐大学',
          'desc': '自学成才'
        },
        {
          'period': {
            'from': 2004,
            'to': 2000
          },
          'school': '茅庐大学',
          'desc': '自学成才'
        }
      ],
      'startups': [
        // {
        //  'period':{
        //    'from':2004,
        //    'to': 2007
        //  },
        //  'projects':'no1',
        //  'desc':'项目1'
        // },
        // {
        //  'period':{
        //    'from':2004,
        //    'to': 2007
        //  },
        //  'projects':'no1',
        //  'desc':'项目2'
        // }
      ],
      'works': [
        {
          'period': {
            'from': 2004,
            'to': 2007
          },
          'corp': '蜀汉',
          'desc': '军师'
        },
        {
          'period': {
            'from': 2004,
            'to': 2007
          },
          'corp': '蜀汉',
          'desc': '军师'
        }
      ],
      'follows': {
        'projects': [/*'pid0', 'pid1', 'pid2'*/],
        'person': [/*'user0','user1','user2'*/]
      },
      'fans': [/*'user3','user4','user5'*/],
      'friends': [/*'user0','user1','user2'*/]
    });
    it('User.create() should be able to save the data to DB and return a fulfilled promise', function () {
      return User.create(user2).should.be.fulfilled;
    });
  });

  after(function () {
    return connection.disconnect();
  });
});