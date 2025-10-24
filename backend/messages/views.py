from rest_framework import generics, status
from rest_framework.response import Response
from django.http import HttpResponse
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment
from .models import Message
from .serializers import MessageSerializer


class MessageListCreateView(generics.ListCreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, *args, **kwargs):
        from django.db import connection
        from django.core.management.color import no_style
        
        count = Message.objects.all().count()
        Message.objects.all().delete()
        
        sequence_sql = connection.ops.sequence_reset_sql(no_style(), [Message])
        if sequence_sql:
            with connection.cursor() as cursor:
                for sql in sequence_sql:
                    cursor.execute(sql)
        
        return Response(
            {'message': f'{count} mensagens foram apagadas com sucesso'},
            status=status.HTTP_200_OK
        )


class MessageUpdateView(generics.UpdateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MessageDeleteView(generics.DestroyAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        message_id = instance.id
        instance.delete()
        return Response(
            {'message': f'Mensagem #{message_id} foi apagada com sucesso'},
            status=status.HTTP_200_OK
        )


class MessageExportView(generics.GenericAPIView):
    def get(self, request, *args, **kwargs):
        messages = Message.objects.all().order_by('-created_at')
        
        workbook = Workbook()
        worksheet = workbook.active
        worksheet.title = "Messages"
        
        headers = ['ID', 'Content', 'Created At', 'Updated At']
        for col, header in enumerate(headers, 1):
            cell = worksheet.cell(row=1, column=col, value=header)
            cell.font = Font(bold=True)
            cell.alignment = Alignment(horizontal='center')
        
        for row, message in enumerate(messages, 2):
            worksheet.cell(row=row, column=1, value=message.id)
            worksheet.cell(row=row, column=2, value=message.content)
            worksheet.cell(row=row, column=3, value=message.created_at.strftime('%Y-%m-%d %H:%M:%S'))
            worksheet.cell(row=row, column=4, value=getattr(message, 'updated_at', message.created_at).strftime('%Y-%m-%d %H:%M:%S'))
        
        for column in worksheet.columns:
            max_length = 0
            column_letter = column[0].column_letter
            for cell in column:
                try:
                    if len(str(cell.value)) > max_length:
                        max_length = len(str(cell.value))
                except:
                    pass
            adjusted_width = min(max_length + 2, 50)
            worksheet.column_dimensions[column_letter].width = adjusted_width
        
        response = HttpResponse(
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename="messages_export.xlsx"'
        
        workbook.save(response)
        return response