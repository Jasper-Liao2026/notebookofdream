import * as React from 'react';

// 1. 定义这个组件需要的 props
interface Props {
    editingName: string;                            // 当前编辑中的文本（由父组件传入）
    onEditingNameUpdated: (newName: string) => void; // 用户打字时，通知父组件
    onNameUpdated: () => void;                       // 用户点确认时，通知父组件保存
    disabled: boolean;                               // 按钮是否禁用
}

const NameEditComponent: React.FC<Props> = (props) => {
    // 2. 解构 props，方便使用
    const { editingName, onEditingNameUpdated, onNameUpdated, disabled } = props;

    // 3. 输入框变化时，调用父组件传来的函数
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onEditingNameUpdated(e.target.value);  // 把输入框的值报告给父组件
    };

    // 4. 点击按钮时，通知父组件保存
    const onSubmit = () => {
        onNameUpdated();
    };

    // 5. 渲染
    return (
        <>
            <label>Update name:</label>
            <input value={editingName} onChange={onChange} />
            <button disabled={disabled} onClick={onSubmit}>
                Change
            </button>
        </>
    );
};

export default NameEditComponent;
