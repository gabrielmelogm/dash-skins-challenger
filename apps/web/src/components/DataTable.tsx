import '../styles/animations.css'

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table'

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	deleteRow?: string | null
}

export function DataTable<TData, TValue>({
	columns,
	data,
	deleteRow,
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	})

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader className="bg-[#0a0a0a]">
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id} className="text-[#a1a1a1]">
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
											  )}
									</TableHead>
								)
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody className="dark:bg-[#0a0a0a]">
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => {
							const id = row.original._id

							return (
								<TableRow
									data-test-id={row.original.email}
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
									className={`${
										id === deleteRow ? 'row-delete' : ''
									} text-white`}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							)
						})
					) : (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className="h-24 text-center text-[#a1a1a1]"
							>
								Sem dados.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	)
}
