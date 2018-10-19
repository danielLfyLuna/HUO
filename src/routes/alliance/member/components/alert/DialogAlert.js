import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import { Modal } from 'antd'

const keys = {
  playerId: '玩家 ID',
  nickname: '玩家昵称',
  platformId: '平台 ID',
  headImageUrl: '头像',
  gender: '性别',
  job: '职业',
  level: '等级',
  vipLevel: 'VIP等级',
  fightCapacity: '战力',
  coin: '钻石',
  coinToken: '绑定钻石',
  gold: '金币',
  curExp: '经验',
  alliance: '联盟',
  personalPos: '个人主城',
  energy: '体力',
  createDate: '创建时间',
  lastLoginDate: '最近登录',
  occupyCity: '占领城池',
  forbieData: '禁言信息',
  soldiers: '将领信息',
  payinfo: '充值信息'
}

const values = (data, maps) => {
  return {
    playerId: data.playerId,
    nickname: data.nickname,
    platformId: data.platformId,
    headImageUrl: <img style={{maxWidth: '150px'}} src={data.headImageUrl} />,
    gender: maps.genderTypes[data.gender],
    job: maps.jobTypes[data.job],
    level: data.level,
    vipLevel: data.vipLevel,
    fightCapacity: data.fightCapacity,
    coin: data.coin,
    coinToken: data.coinToken,
    gold: data.gold,
    curExp: data.curExp,
    alliance: data.alliance,
    personalPos: data.personalPos,
    energy: data.energy,
    createDate: moment(data.createDate).format('YYYY-MM-DD HH:mm:ss'),
    lastLoginDate: moment(data.lastLoginDate).format('YYYY-MM-DD HH:mm:ss'),
    occupyCity: data.occupyCity,
    forbieData: data.forbidList && data.forbidList.length ? _.join(_.values(_.pick(maps.forbidTypes, data.forbidList)), '；') : '正常',
    soldiers: data.soldiers,
    payinfo: data.payinfo
  }
}

export function info(data, maps) {
  let view = []
  _.reduce(values(data, maps), (result, value, key) => {
    result.push(
      <li key={key}>
        <span>{keys[key]}:&nbsp;</span>
        <span>{value}</span>
      </li>
    )
    return result
  }, view)

  Modal.info({
    title: '查看详细信息',
    okText: '关闭',
    width: 600,
    content: (
      <div className='box-large'>
        <ul className='box-list'>
          {view}
        </ul>
      </div>
    ),
    onOk() {}
  })
}
