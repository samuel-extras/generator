import "./App.css";
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  // DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ThemeProvider } from "./components/theme-provider";
import { Label } from "./components/ui/label";

const data: Payment[] = [
  {
    id: "m5gr84i9",
    balance: 316,
    address: "0x86e154587c5Bc5B783762151CA62d881b5e243E4",
  },
  {
    id: "3u1reuv4",
    balance: 242,
    address: "0x86e154587c5Bc5B783762151CA62d881b5e243E4",
  },
  {
    id: "derv1ws0",
    balance: 837,
    address: "0x86e154587c5Bc5B783762151CA62d881b5e243E4",
  },
  {
    id: "5kma53ae",
    balance: 874,
    address: "0x86e154587c5Bc5B783762151CA62d881b5e243E4",
  },
  {
    id: "bhqecj4p",
    balance: 721,
    address: "0x86e154587c5Bc5B783762151CA62d881b5e243E4",
  },
];

export type Payment = {
  id: string;
  balance: number;
  address: string;
};

function getTruncatedString(str: string): string {
  if (str.length <= 10) {
    return str; // If string is less than or equal to 10 characters, return it as is
  }
  const firstPart = str.slice(0, 4);
  const lastPart = str.slice(-6);
  return `${firstPart}...${lastPart}`;
}

export const columns: ColumnDef<Payment>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="place-self-center align-middle self-center"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },

  {
    accessorKey: "address",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Wallet Address
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase text-left">
        {getTruncatedString(row.getValue("address"))}
      </div>
    ),
  },
  {
    accessorKey: "balance",
    header: () => <div className="text-right">Balance</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("balance"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy Address
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Send From Wallet</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function App() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {true ? (
        <div className="w-full max-w-xl mx-auto">
          <div className="flex items-center py-4 justify-between">
            <Input
              placeholder="Filter Address..."
              value={
                (table.getColumn("address")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("address")?.setFilterValue(event.target.value)
              }
              className="max-w-xs"
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button>Airdrop</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Airdrop wallets</DialogTitle>
                  <DialogDescription>
                    send token from main wallet to other wallet
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="numberOfWallet"
                      className="text-left
                  "
                    >
                      Amount
                    </Label>
                    <Input
                      id="numberOfWallet"
                      className="col-span-4"
                      type="number"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Send</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          // className={i == 0 ? "text-center" : ""}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="h-screen w-full flex flex-col justify-center items-center">
          <svg
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
            className="w-12 h-12 mb-3"
          >
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            ></path>
          </svg>
          <h1 className="font-semibold">No Wallet Address</h1>
          <p className="text-center text-sm mb-8">
            Click the generate button below to generate Wallet addresses
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Generate Wallet Addresses</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Wallet</DialogTitle>
                <DialogDescription>
                  Generate the number of Wallet you want
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="numberOfWallet"
                    className="text-left
                  "
                  >
                    Quantity
                  </Label>
                  <Input
                    id="numberOfWallet"
                    className="col-span-4"
                    type="number"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Generate</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </ThemeProvider>
  );
}
