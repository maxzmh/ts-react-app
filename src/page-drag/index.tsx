import React, {useReducer} from 'react'
import {DeleteOutlined} from '@ant-design/icons'
import __style from './index.less'

interface DragProps { } 
interface IState {
    taskList: {
        task: string;
    }[];
    dailyList: {
        key: string;
        time: string;
        content: string;
    }[];
    fromIndex: number;
    fromItem: {};
    toIndex: number;
}

const dayList:Array<string> = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

const Drag:React.FC<DragProps> = () => {
  const getDefaultKey = () => {
    const s = []
    const hexDigits = 'abcdefghijklmnopqsrtuvwxyz'
    for (let i = 0; i < 10; i += 1) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    const key = s.join('')
    return key
  }
  const reducer = (state: IState, action) => {
    switch (action.type) {
      case 'dragstart':
        return {
          ...state,
          fromItem: action.value.item, 
          fromIndex: action.value.index,
        }
      case 'dragover':
        return {
          ...state,
          toIndex: action.value.index,
        }
      case 'drop':
        return {
          ...state,
          dailyList: action.value.list,
          toIndex: -1,
          fromIndex: -1,
        } 
      case 'delete':
        return {
          ...state,
          dailyList: action.value.list,
        }  
      default:
        throw new Error()
    }
  }

  const [state, dispatch] = useReducer(reducer, {
    taskList: [
      {
        task: '阅读',
      },
      {
        task: '喝茶',
      },
      {
        task: '上网',
      },
      {
        task: '娱乐',
      },
    ],
    dailyList: [
      {
        key: getDefaultKey(),
        time: dayList[new Date().getDay()],
        content: '工作',
      },
    ],
    fromIndex: -1,
    fromItem: {},
    toIndex: -1,
  })

  const {
    dailyList, fromIndex, fromItem, taskList, toIndex,
  } = state

  // 开始拖动
const handleDragStart = (e, item, index?) => {
    dispatch({type: 'dragstart', value: {item, index}})
  }

  // 拖动目标容器，阻止默认事件
  const handleDragOver = e => {
    e.preventDefault()
  }

  // 在目标容器中放置，触发增加
  const handleDrop = e => {
    const arr = [].concat(dailyList)
    if (fromIndex >= 0) {
      if (fromIndex === toIndex) {
        dispatch({type: 'drop', value: {list: arr}})
        return
      } if (fromIndex < toIndex) {
        // 从上往下
        arr.splice(toIndex, 0, fromItem)
        arr.splice(fromIndex, 1)
      } else if (fromIndex > toIndex) {
        // 从下往上
        arr.splice(fromIndex, 1)
        arr.splice(toIndex, 0, fromItem)
      }
    } else {
      const nowDay = dayList[new Date().getDay()]
      arr.splice(toIndex, 0, {
        key: getDefaultKey(),
        time: nowDay,
        content: fromItem.task,
      })
    }
    dispatch({type: 'drop', value: {list: arr}})
  }

  // 进入目标容器
  const handleDragEnter = (e, item, index) => {
    // 鼠标的坐标
    const pointY = e.clientY
    let endIndex = -1
    if (index >= 0 && index < dailyList.length) {
      const element = document.getElementById(item.key)
      // 元素的中间位置= 元素的高度（包括边框和填充）/ 2 + 元素的上边框纵坐标
      const midPosition = element.offsetHeight / 2 + element.offsetTop
      // pointY
      endIndex = pointY > midPosition ? index + 1 : index
    } else {
      endIndex = index
    }
    dispatch({type: 'dragover', value: {index: endIndex}})
  }

  // 删除控件
  const deleteItem = index => {
    const arr = [].concat(dailyList)
    arr.splice(index, 1)
    dispatch({type: 'drop', value: {list: arr}})
  }

    return (
        <div className={__style.dragApp}>
        <div
          className={__style.box}
          onDragOver={e => handleDragOver(e)}
        >
          <h1>Task List</h1>
          {taskList.map((item, index) => (
            <div 
              draggable
              className={`${__style.item} ${__style.taskItem}`}
              onDragStart={e => handleDragStart(e, item)}
              key={`${item.task}`}
            >
              {item.task}
            </div>
          ))}
        </div>
        <div
          className={__style.box}
          id="drag-box" 
          onDragOver={e => handleDragOver(e)}
          onDragLeave={(e:any) => {
            if (e.target.id === 'drag-box') {
              dispatch({type: 'dragover', value: {index: -1}})
            }
          }}
        >
          <h1>Daily List</h1>
          {dailyList.map((item, index) => (
            <div
              onDrop={e => handleDrop(e)}
              onDragOver={e => handleDragOver(e)}
              onDragEnter={e => handleDragEnter(e, item, index)}
              className={__style.itemBox}
              key={`${item.key}`}
            >
              <div 
                className={`${toIndex > -1 && index === toIndex ? __style.blockBox : __style.noneBox}`}
              >
                将控件拖拽到此……
              </div>
              <div 
                draggable
                id={`${item.key}`}
                className={`${index === fromIndex ? __style.slideItem : ''} ${__style.item} ${__style.dailyItem}`}
                onDragStart={e => handleDragStart(e, item, index)}
               
              >
                <div className={__style.delete}>
                  <div>
                    time:
                    {item.time}
                  </div>
                  <DeleteOutlined onClick={() => deleteItem(index)} />
                </div>
                <p>
                  daily:
                  {item.content}
                </p>
              </div>
             
            </div>
            
          ))}
        <div className={__style.itemBox}>
            <div 
              className={__style.blockBox}
              onDragEnter={e => handleDragEnter(e, {}, dailyList.length)}
              onDragOver={e => handleDragOver(e)}
              onDrop={e => handleDrop(e)}
            >
              将控件拖拽到此……
            </div>
          </div>
          
        </div>
      </div>
  )
}
  
export default Drag
