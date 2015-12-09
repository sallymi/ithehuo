var config = {
  name: 'IT合伙人',
  host: 'ithehuo.com',
  secret: 'SVTlkIjkvJnkuro=',
  mailer: {
    host: 'smtp.126.com',
    port: 25,
    auth: {
      user: 'service_ithhr@126.com',
      pass: 'J.zuRI6eDYO^*[Aw'
    }
  },
  log_level: 'debug',
  province:[
  {
    display: '其他',
    alias: '其他 qita qt',
    value:'其他',
    tokens:['其他']
  },
  {
    display: '北京',
    alias: '北京 beijing bj',
    value:'北京',
    tokens:['北京']
  },
  {
    display: '上海',
    alias: '上海 shanghai sh',
    value:'上海',
    tokens:['上海']
  },
  {
    display: '天津',
    alias: '天津 tianjin tj',
    value:'天津',
    tokens:['天津']
  },
  {
    display: '重庆',
    alias: '重庆 chongqing cq',
    value:'重庆',
    tokens:['重庆']
  },
  {
    display: '内蒙古',
    alias: '内蒙古 neimenggu nmg',
    value:'内蒙古',
    tokens:['内蒙古']
  },
  {
    display: '黑龙江',
    alias: '黑龙江 heilongjiang hlj',
    value:'黑龙江',
    tokens:['黑龙江']
  },
  {
    display: '宁夏',
    alias: '宁夏 ningxia nx',
    value:'宁夏',
    tokens:['宁夏']
  },
  {
    display: '广西',
    alias: '广西 guangxi gx',
    value:'广西',
    tokens:['广西']
  },
  {
    display: '西藏',
    alias: '西藏 xizang Tibet xz',
    value:'西藏',
    tokens:['西藏']
  },
  {
    display: '吉林',
    alias: '吉林 jilin jl',
    value:'吉林',
    tokens:['吉林']
  },
  {
    display: '辽宁',
    alias: '辽宁 liaoning ln',
    value:'辽宁',
    tokens:['辽宁']
  },
  {
    display: '河北',
    alias: '河北 hebei hb',
    value:'河北',
    tokens:['河北']
  },
  {
    display: '河南',
    alias: '河南 henan hn',
    value:'河南',
    tokens:['河南']
  },
  {
    display: '山东',
    alias: '山东 shandong sd',
    value:'山东',
    tokens:['山东']
  },
  {
    display: '山西',
    alias: '山西 shanxi sx',
    value:'山西',
    tokens:['山西']
  },
  {
    display: '湖南',
    alias: '湖南 hunan hn',
    value:'湖南',
    tokens:['湖南']
  },
  {
    display: '湖北',
    alias: '湖北 hubei hb',
    value:'湖北',
    tokens:['湖北']
  },
  {
    display: '安徽',
    alias: '安徽 anhui ah',
    value:'安徽',
    tokens:['安徽']
  },
  {
    display: '江苏',
    alias: '江苏 jiangsu js',
    value:'江苏',
    tokens:['江苏']
  },
  {
    display: '浙江',
    alias: '浙江 zhejiang zj',
    value:'浙江',
    tokens:['浙江']
  },
  {
    display: '福建',
    alias: '福建 fujian fj',
    value:'福建',
    tokens:['福建']
  },
  {
    display: '江西',
    alias: '江西 jiangxi jx',
    value:'江西',
    tokens:['江西']
  },
  {
    display: '广东',
    alias: '广东 guangdong gd',
    value:'广东',
    tokens:['广东']
  },
  {
    display: '海南',
    alias: '海南 hainan hn',
    value:'海南',
    tokens:['海南']
  },
  {
    display: '贵州',
    alias: '贵州 guizhou gz',
    value:'贵州',
    tokens:['贵州']
  },
  {
    display: '云南',
    alias: '云南 yunnan yn',
    value:'云南',
    tokens:['云南']
  },
  {
    display: '四川',
    alias: '四川 sichuan sc',
    value:'四川',
    tokens:['四川']
  },
  {
    display: '陕西',
    alias: '陕西 shanxi shx',
    value:'陕西',
    tokens:['陕西']
  },
  {
    display: '青海',
    alias: '青海 qinghai qh',
    value:'青海',
    tokens:['青海']
  },
  {
    display: '甘肃',
    alias: '甘肃 gansu gs',
    value:'甘肃',
    tokens:['甘肃']
  },
  {
    display: '台湾',
    alias: '台湾 Taiwan TW',
    value:'台湾',
    tokens:['台湾']
  },
  {
    display: '香港',
    alias: '香港 HongKong HKG',
    value:'香港',
    tokens:['香港']
  },
  {
    display: '澳门',
    alias: '澳门 Macao',
    value:'澳门',
    tokens:['澳门']
  }
  ],
  city:[
  {
    display: '其他',
    alias: '其他 qita qt',
    value:'其他',
    tokens:['其他']
  },
  {
    display: '北京',
    alias: '北京 beijing bj',
    value:'北京',
    tokens:['北京'],
    hot: 1
  },
  {
    pinyin: '上海',
    alias: '上海 shanghai sh',
    value:'上海',
    tokens:['上海']
  },
  {
    pinyin: '杭州',
    alias: '杭州 hangzhou hz',
    value:'杭州',
    tokens:['杭州']
  },
  {
    pinyin: '广州',
    alias: '广州 guangzhou gz',
    value:'广州',
    tokens:['广州']
  },
  {
    pinyin: '西安',
    alias: '西安 xian xa',
    value:'西安',
    tokens:['西安']
  },
  {
    pinyin: '深圳',
    alias: '深圳 shenzhen sz',
    value:'深圳',
    tokens:['深圳']
  },
  {
    pinyin: '成都',
    alias: '成都 chengdu cd',
    value:'成都',
    tokens:['成都']
  },
  {
    pinyin: '南京',
    alias: '南京 nanjing nj',
    value:'南京',
    tokens:['南京']
  },
  {
    pinyin: '武汉',
    alias: '武汉 wuhan wh',
    value:'武汉',
    tokens:['武汉']
  },
  {
    pinyin: '厦门',
    alias: '厦门 xiamen xm',
    value:'厦门',
    tokens:['厦门']
  },
  {
    pinyin: '长沙',
    alias: '长沙 changsha cs',
    value:'长沙',
    tokens:['长沙']
  },
  {
    pinyin: '苏州',
    alias: '苏州 suzhou sz',
    value:'苏州',
    tokens:['苏州']
  },
  {
    pinyin: '天津',
    alias: '天津 tianjin tj',
    value:'天津',
    tokens:['天津']
  },
  {
    pinyin: '重庆',
    alias: '重庆 chongqing chq',
    value:'重庆',
    tokens:['重庆']
  },
  {
    pinyin: '郑州',
    alias: '郑州 zhengzhou zz',
    value:'郑州',
    tokens:['郑州']
  },
  {
    pinyin: '青岛',
    alias: '青岛 qingdao qd',
    value:'青岛',
    tokens:['青岛']
  },
  {
    pinyin: '合肥',
    alias: '合肥 hefei hf',
    value:'合肥',
    tokens:['合肥']
  },
  {
    pinyin: '福州',
    alias: '福州 fuzhou fz',
    value:'福州',
    tokens:['福州']
  },
  {
    pinyin: '济南',
    alias: '济南 jinan jn',
    value:'济南',
    tokens:['济南']
  },
  {
    pinyin: '大连',
    alias: '大连 dalian dl',
    value:'大连',
    tokens:['大连']
  },
  {
    pinyin: '珠海',
    alias: '珠海 zhuhai zh',
    value:'珠海',
    tokens:['珠海']
  },
  {
    pinyin: '无锡',
    alias: '无锡 wuxi wx',
    value:'无锡',
    tokens:['无锡']
  },
  {
    pinyin: '佛山',
    alias: '佛山 fuoshan fs',
    value:'佛山',
    tokens:['佛山']
  },
  {
    pinyin: '东莞',
    alias: '东莞 dongguan dg',
    value:'东莞',
    tokens:['东莞']
  },
  {
    pinyin: '宁波',
    alias: '宁波 ningbo nb',
    value:'宁波',
    tokens:['宁波']
  },
  {
    pinyin: '常州',
    alias: '常州 changzhou cz',
    value:'常州',
    tokens:['常州']
  },
  {
    pinyin: '沈阳',
    alias: '沈阳 shenyang sy',
    value:'沈阳',
    tokens:['沈阳']
  },
  {
    pinyin: '石家庄',
    alias: '石家庄 shijiazhuang sjz',
    value:'石家庄',
    tokens:['石家庄']
  },
  {
    pinyin: '南昌',
    alias: '南昌 nanchang nc',
    value:'南昌',
    tokens:['南昌']
  },
  {
    pinyin: '南宁',
    alias: '南宁 nanning nn',
    value:'南宁',
    tokens:['南宁']
  },
  {
    pinyin: '哈尔滨',
    alias: '哈尔滨 haerbin hb',
    value:'哈尔滨',
    tokens:['哈尔滨']
  },
  {
    pinyin: '海口',
    alias: '海口 haikou hk',
    value:'海口',
    tokens:['海口']
  },
  {
    pinyin: '中山',
    alias: '中山 zhongshan zs',
    value:'中山',
    tokens:['中山']
  },
  {
    pinyin: '惠州',
    alias: '惠州 huizhou hz',
    value:'惠州',
    tokens:['惠州']
  },
  {
    pinyin: '贵阳',
    alias: '贵阳 guiyang gy',
    value:'贵阳',
    tokens:['贵阳']
  },
  {
    pinyin: '长春',
    alias: '长春 changchun cc',
    value:'长春',
    tokens:['长春']
  },
  {
    pinyin: '太原',
    alias: '太原 taiyuan ty',
    value:'太原',
    tokens:['太原']
  },
  {
    pinyin: '嘉兴',
    alias: '嘉兴 jiaxing jx',
    value:'嘉兴',
    tokens:['嘉兴']
  },
  {
    pinyin: '泰安',
    alias: '泰安 taian ta',
    value:'泰安',
    tokens:['泰安']
  },
  {
    pinyin: '昆明',
    alias: '昆明 kunming km',
    value:'昆明',
    tokens:['昆明']
  },
  {
    pinyin: '昆山',
    alias: '昆山 kunshan ks',
    value:'昆山',
    tokens:['昆山']
  },
  {
    pinyin: '烟台',
    alias: '烟台 yantai yt',
    value:'烟台',
    tokens:['烟台']
  },
  {
    pinyin: '兰州',
    alias: '兰州 lanzhou lz',
    value:'兰州',
    tokens:['兰州']
  },
  {
    pinyin: '泉州',
    alias: '泉州 quanzhou qz',
    value:'泉州',
    tokens:['泉州']
  }
  ],
  filed:[
  {
    alias: '移动互联网 移动 互联网',
    value:'移动互联网',
    tokens:['移动','互联网']
  },
  {
    alias: 'O2O',
    value:'O2O',
    tokens:['O2O']
  },
  {
    alias: '游戏',
    value:'游戏',
    tokens:['游戏']
  },
  {
    alias: '电子商务 电子 商务',
    value:'电子商务',
    tokens:['电子','商务']
  },
  {
    alias: '社交网络 社交 网络',
    value:'社交网络',
    tokens:['社交','互联网']
  },
  {
    alias: '金融',
    value:'金融',
    tokens:['金融']
  },
  {
    alias: '教育',
    value:'教育',
    tokens:['教育']
  },
  {
    alias: '文化娱乐 文化 娱乐',
    value:'文化娱乐',
    tokens:['文化','娱乐']
  },
  {
    alias: '旅游',
    value:'旅游',
    tokens:['旅游']
  },
  {
    alias: '医疗健康 医疗 健康',
    value:'医疗健康',
    tokens:['医疗','健康']
  },
  {
    alias: '生活服务 生活 服务',
    value:'生活服务',
    tokens:['生活','服务']
  },
  {
    alias: '硬件',
    value:'硬件',
    tokens:['硬件']
  },
  {
    alias: '智能手机 智能 手机',
    value:'智能手机',
    tokens:['智能','手机']
  },
  {
    alias: '可穿戴设备 可穿戴 设备',
    value:'可穿戴设备',
    tokens:['可穿戴','设备']
  },
  {
    alias: '信息安全 信息 安全',
    value:'信息安全',
    tokens:['信息','安全']
  },
  {
    alias: '企业服务 企业 服务',
    value:'企业服务',
    tokens:['企业','服务']
  },
  {
    alias: '数据服务 数据 服务',
    value:'数据服务',
    tokens:['数据','服务']
  },
  {
    alias: '广告营销 广告 营销',
    value:'广告营销',
    tokens:['广告','营销']
  },
  {
    alias: '分类信息 分类 信息',
    value:'分类信息',
    tokens:['分类','信息']
  },
  {
    alias: '招聘',
    value:'招聘',
    tokens:['招聘']
  }
  ]
};

// TODO: need to move to db and provide admin UI to manage
config.filters = {};
config.filters.projects =
  [{
    item: 'projects',
    name: '位置',
    key: 'location',
    values: ['北京', '上海', '广州', '深圳'],
    categories: [{
      name: 'ABCDE',
      values: ['北京','成都','长沙','重庆','大连','东莞','常州','长春']
    },{
      name: 'FGHJ',
      values: ['广州','杭州','合肥','福州','济南','佛山','哈尔滨','海口','惠州','贵阳','嘉兴']
    },{
      name: 'KLMNP',
      values: ['南京','宁波','昆明','南昌','南宁','昆山','兰州']
    },{
       name: 'QRSTW',
      values:['上海','深圳','苏州','天津','青岛','沈阳','石家庄','太原','泰安','泉州']
    },{
       name: 'XYWZ',
      values:['武汉','西安','厦门','郑州','珠海','无锡','中山','烟台']
    },
    {
       name: '其他',
      values: ['香港','澳门','台湾','国际']
    }]
  }, {
    item: 'projects',
    name: '项目阶段',
    key: 'stage',
    values: ['想法构思', '正在实现', '测试版已发布', '正式版已发布']
  }, {
    item: 'projects',
    name: '需要的合伙人',
    key: 'recruitment',
    values: ['技术合伙人', '产品设计合伙人', '运营合伙人', '市场营销合伙人', '资源合伙人', '投资合伙人','顾问/导师合伙人']
  }, {
    item: 'projects',
    name: '当前融资情况',
    key: 'funding.current',
    values: ['50万以下', '51-100万', '101-500万', '501-2000万', '2000万以上']
  }, {
    item: 'projects',
    name: '需要的融资',
    key: 'funding.next.need',
    values: ['50万以下', '51-100万', '101-500万', '501-2000万', '2000万以上']
  }, {
    item: 'projects',
    name: '领域方向',
    key: 'tag',
    values: ['电子商务', '移动互联网', 'O2O', '游戏'],
    categories: [{
      name: '互联网',
      values: ['电子商务', '社交网络', '移动互联网']
    }, {
      name: '互联网+',
      values: ['金融', '教育','文化娱乐','游戏','旅游','医疗健康','生活服务']
    }, {
      name: 'O2O',
      values: ['O2O']
    }, {
      name: '硬件',
      values: ['硬件', '智能手机', '可穿戴设备']
    }, {
      name: '企业服务',
      values: ['信息安全','企业服务','数据服务','广告营销','分类信息','招聘']
    }]
  }];

config.filters.recruitments =
  [{
    item: 'recruitments',
    name: '位置',
    key: 'location',
    values: ['北京', '上海', '广州', '深圳'],
    categories: [{
      name: 'ABCDE',
      values: ['北京','成都','长沙','重庆','大连','东莞','常州','长春']
    },{
      name: 'FGHJ',
      values: ['广州','杭州','合肥','福州','济南','佛山','哈尔滨','海口','惠州','贵阳','嘉兴']
    },{
      name: 'KLMNP',
      values: ['南京','宁波','昆明','南昌','南宁','昆山','兰州']
    },{
       name: 'QRSTW',
      values:['上海','深圳','苏州','天津','青岛','沈阳','石家庄','太原','泰安','泉州']
    },{
       name: 'XYWZ',
      values:['武汉','西安','厦门','郑州','珠海','无锡','中山','烟台']
    },
    {
       name: '其他',
      values: ['香港','澳门','台湾','国际']
    }]
  }, {
    item: 'recruitments',
    name: '合伙类别',
    key: 'project.stage',
    values: ['想法构思', '正在实现', '测试版已发布', '正式版已发布']
  }, {
    item: 'recruitments',
    name: '合伙类别',
    key: 'classify',
    values: ['技术合伙人', '产品设计合伙人', '运营合伙人', '市场营销合伙人', '资源合伙人', '投资合伙人','顾问/导师合伙人']
  }, {
    item: 'recruitments',
    name: '合伙方式',
    key: 'work_nature',
    values: ['全职', '兼职', '双方协商']
  }, {
    item: 'recruitments',
    name: '领域方向',
    key: 'project.tag',
    values: ['电子商务', '移动互联网', 'O2O', '游戏'],
    categories: [{
      name: '互联网',
      values: ['电子商务', '社交网络', '移动互联网']
    }, {
      name: '互联网+',
      values: ['金融', '教育','文化娱乐','游戏','旅游','医疗健康','生活服务']
    }, {
      name: 'O2O',
      values: ['O2O']
    }, {
      name: '硬件',
      values: ['硬件', '智能手机', '可穿戴设备']
    }, {
      name: '企业服务',
      values: ['信息安全','企业服务','数据服务','广告营销','分类信息','招聘']
    }]
  }];

config.filters.users =
  [{
    item: 'users',
    name: '角色定位',
    key: 'role',
    values: ['创始人', '技术合伙人', '产品设计合伙人', '运营合伙人', '市场营销合伙人', '资源合伙人', '投资合伙人','顾问/导师合伙人']
  }, {
    item: 'users',
    name: '所在地',
    key: 'location',
    values: ['北京', '上海', '广州', '深圳'],
    categories: [{
      name: 'ABCDE',
      values: ['北京','成都','长沙','重庆','大连','东莞','常州','长春']
    },{
      name: 'FGHJ',
      values: ['广州','杭州','合肥','福州','济南','佛山','哈尔滨','海口','惠州','贵阳','嘉兴']
    },{
      name: 'KLMNP',
      values: ['南京','宁波','昆明','南昌','南宁','昆山','兰州']
    },{
       name: 'QRSTW',
      values:['上海','深圳','苏州','天津','青岛','沈阳','石家庄','太原','泰安','泉州']
    },{
       name: 'XYWZ',
      values:['武汉','西安','厦门','郑州','珠海','无锡','中山','烟台']
    },
    {
       name: '其他',
      values: ['香港','澳门','台湾','国际']
    }]
  }, {
    item: 'users',
    name: '领域方向',
    key: 'field',
    values: ['电子商务', '移动互联网', 'O2O', '游戏'],
    categories: [{
      name: '互联网',
      values: ['电子商务', '社交网络', '移动互联网']
    }, {
      name: '互联网+',
      values: ['金融', '教育','文化娱乐','游戏','旅游','医疗健康','生活服务']
    }, {
      name: 'O2O',
      values: ['O2O']
    }, {
      name: '硬件',
      values: ['硬件', '智能手机', '可穿戴设备']
    }, {
      name: '企业服务',
      values: ['信息安全','企业服务','数据服务','广告营销','分类信息','招聘']
    }]
  }, {
    item: 'users',
    name: '创业倾向',
    key: 'prefer',
    values: ['兼职创业', '全职主导创业', '全职参与创业']
  }, {
    item: 'users',
    name: '当前状态',
    key: 'status',
    values: ['没有任何创业', '兼职创业中', '全职创业中']
  }, {
    item: 'users',
    name: '年龄区间',
    key: 'age',
    values: [{
      name: '25岁以下',
      query: 'age$lt=25'
    }, {
      name: '25-30岁',
      query: 'age$gte=25&age$lte=30'
    }, {
      name: '30-35岁',
      query: 'age$gte=30&age$lte=35'
    }, {
      name: '35-40岁',
      query: 'age$gte=35&age$lte=40'
    }, {
      name: '40岁以上',
      query: 'age$gt=40'
    }]
  }, {
    item: 'users',
    name: '是校友',
    key: 'schoolmates',
    values: [{
      name: '是校友',
      query: 'schoolmate=true'
    },{
      name: '不是校友',
      query: 'schoolmate=false'
    }]
  }, {
    item: 'users',
    name: '是老乡',
    key: 'fellow',
    values: [{
      name: '是老乡',
      query: 'fellow=true'
    }, {
      name: '不是老乡',
      query: 'fellow=false'
    }]
  }, {
    item: 'users',
    name: '前同事',
    key: 'exworkmate',
    values: [{
      name: '前同事',
      query: 'exworkmate=true'
    }, {
      name: '不是同事',
      query: 'exworkmate=false'
    }]
  }];

module.exports = config;