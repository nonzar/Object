20140825
�˽���

����һ������ѭ�����б�Ч��

HOW TO USE

first of all��load require.js��
<script src="../../html-common/base/js/require.js"></script>

then type��

require(['../modules/nz_cyclistCtrl/cyclist.js'], function (cyclistCtrlM) {
    var myCyc = cyclistCtrlM.init.createNew();
    myCyc.init({
        count: 10,//�б�Ԫ������
    });
    g_cyclistCtrl = myCyc;
    g_cyclistCtrl.getPrev(1);//��ȡ���˺��б�Ԫ�ض�Ӧ�����������ţ��������ƶ����ٴΣ���ѡ��Ĭ��1��
    g_cyclistCtrl.getNext(1);//��ȡ���˺��б�Ԫ�ض�Ӧ�����������ţ��������ƶ����ٴΣ���ѡ��Ĭ��1��
});
