import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

export function formatDate(date: string | null): string {
  if (!date) {
    return '';
  }

  return format(new Date(date), 'dd MMM yyyy', { locale: ptBR });
}
